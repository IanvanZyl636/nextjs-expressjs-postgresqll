import crypto from 'crypto';
import { PaymentStatus } from '@nextjs-expressjs-postgresql/shared/prisma/enhance/enums';
import https from 'https';

function getBaseUrl() {
  const sandbox = (process.env.PAYFAST_SANDBOX ?? 'true') === 'true';
  return sandbox ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';
}

const validNotificationDomains = [
  'www.payfast.co.za',
  'w1w.payfast.co.za',
  'w2w.payfast.co.za',
  'sandbox.payfast.co.za'
];

export const PAYFAST_IP_WHITELIST = [
  '197.97.145.144/28',
  '41.74.179.192/27',
  '102.216.36.0/28',
  '102.216.36.128/28',
  '144.126.193.139'
]

function toTwoDecimals(n: number) {
  return n.toFixed(2);
}

function phpUrlEncode(value: string): string {
  return encodeURIComponent(value)
    .replace(/%20/g, '+')
    .replace(/[!'()*]/g, c =>
      '%' + c.charCodeAt(0).toString(16).toUpperCase()
    );
}

function generateSignature(
  data: Record<string, string | number | null | undefined>,
  passPhrase?: string | null
): string {
  let pfOutput = '';

  for (const [key, val] of Object.entries(data)) {    
    pfOutput += `${key}=${phpUrlEncode(String(val).trim())}&`;    
  }

  let getString = pfOutput.slice(0, -1);

  if (passPhrase) {
    getString += `&passphrase=${phpUrlEncode(passPhrase.trim())}`;
  }

  return crypto
    .createHash('md5')
    .update(getString)
    .digest('hex');
}

export async function createCheckout(payment: any, opts: { amount: number; returnUrl?: string; cancelUrl?: string; notifyUrl?: string; itemName?: string }) {
  const params: Record<string, any> = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY,
    return_url: opts.returnUrl,
    cancel_url: opts.cancelUrl,
    notify_url: opts.notifyUrl,
    // name_first:
    // name_last:
    // email_address:
    // cell_number:
    m_payment_id: payment.id,
    amount: toTwoDecimals(opts.amount),
    item_name: opts.itemName,
    payment_method: 'cc'
  };

  const signature = generateSignature(params, process.env.PAYFAST_PASSPHRASE);

  const form: Record<string, string> = { ...params, signature };

  // PayFast expects POST form submission to their process URL.
  return {
    method: 'POST' as const,
    action: getBaseUrl(),
    form
  };
}

function verifySignature(payload: Record<string, any>): boolean {
  const { signature } = payload;
  if (!signature) return false;

  const payloadCopy = { ...payload };
  delete payloadCopy.signature;

  const expected = generateSignature(payloadCopy, process.env.PAYFAST_PASSPHRASE);
  return expected === signature;
}

// Security check 2: Verify the notification came from PayFast domain
function verifyNotificationSource(remoteAddress: string, domain: string): boolean {

  if (!validNotificationDomains.includes(domain)) {
    throw new Error(`Payfast: Notification from unexpected domain: ${domain}`);
  }

  
  
  return true;
}

// Security check 3: Compare payment data (done in the service)
// This will be handled by comparing the notification amount with stored order amount

// Security check 4: Perform server request to confirm with PayFast
async function confirmPaymentWithPayFast(payload: Record<string, any>): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const sandbox = (process.env.PAYFAST_SANDBOX ?? 'true') === 'true';
    const host = sandbox ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';

    // Build query string for confirmation
    const queryParams = new URLSearchParams();
    for (const [key, val] of Object.entries(payload)) {
      if (val !== '' && val !== null && val !== undefined) {
        queryParams.append(key, String(val));
      }
    }

    const options = {
      hostname: host,
      port: 443,
      path: `/eng/query/validate?${queryParams.toString()}`,
      method: 'GET',
      headers: {
        'User-Agent': 'NodeJS',
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        // PayFast returns 'VALID' for confirmed payments
        resolve(data.trim() === 'VALID');
      });
    });

    req.on('error', (err) => {
      console.error('Error confirming payment with PayFast:', err);
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('PayFast confirmation timeout'));
    });

    req.end();
  });
}

export async function verifyNotification(
  payload: Record<string, any>,
  options?: { remoteAddress?: string; domain?:string, skipServerConfirmation?: boolean }
) {  
  const { signature, m_payment_id } = payload;
  if (!signature || !m_payment_id) throw new Error('Invalid notification payload');

  // Security Check 1: Verify the signature
  if (!verifySignature(payload)) {
    throw new Error('Invalid signature');
  }

  // Security Check 2: Verify notification source (if remoteAddress provided)
  if (options?.remoteAddress && options?.domain && !verifyNotificationSource(options.remoteAddress, options.domain)) {
    throw new Error('Payfast: Notification from unexpected IP address: ' + options.remoteAddress);    
  }

  // Security Check 4: Perform server confirmation (if not skipped)
  if (!options?.skipServerConfirmation) {
    try {
      const isValid = await confirmPaymentWithPayFast(payload);
      if (!isValid) {
        throw new Error('PayFast server confirmation failed: Payment not valid on PayFast servers');
      }
    } catch (err) {
      throw new Error(`Server confirmation failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const statusRaw = String(payload.payment_status ?? '').toUpperCase();

  // Map PayFast statuses to PaymentStatus
  let status:PaymentStatus = PaymentStatus.FAILED;
  // PayFast 'PAID' maps to our 'COMPLETED' enum value
  if (statusRaw === 'PAID') status = (PaymentStatus as any).COMPLETED ?? (PaymentStatus as any).PAID ?? PaymentStatus.FAILED;
  if (statusRaw === 'FAILED') status = PaymentStatus.FAILED;
  if (statusRaw === 'CANCELLED') status = PaymentStatus.CANCELLED;
  if (statusRaw === 'REFUNDED') status = PaymentStatus.REFUNDED;

  return {
    paymentId: m_payment_id,
    status,
    providerRef: payload.payfast_payment_id ?? undefined,
  };
}
