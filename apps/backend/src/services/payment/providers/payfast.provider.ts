import crypto from 'crypto';
import { PaymentStatus } from '@nextjs-expressjs-postgresql/shared/prisma/enhance/enums';

function getBaseUrl() {
  const sandbox = (process.env.PAYFAST_SANDBOX ?? 'true') === 'true';
  return sandbox ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';
}

function toTwoDecimals(n: number) {
  return n.toFixed(2);
}

function generateSignature(params: Record<string, any>) {
  const passphrase = process.env.PAYFAST_PASSPHRASE;

  // sort keys alphabetically and build URL encoded string (PayFast expects percent-encoding of values)
  const keys = Object.keys(params).filter(k => params[k] !== undefined && params[k] !== null).sort();
  const pieces: string[] = [];
  for (const k of keys) {
    pieces.push(`${k}=${String(params[k])}`);
  }

  let str = pieces.join('&');
  if (passphrase) str = `${str}&passphrase=${passphrase}`;

  return crypto.createHash('md5').update(str).digest('hex');
}

export async function createCheckout(payment: any, opts: { amount: number; returnUrl?: string; cancelUrl?: string; notifyUrl?: string; itemName?: string }) {
  const params: Record<string, any> = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY,
    return_url: opts.returnUrl,
    cancel_url: opts.cancelUrl,
    notify_url: opts.notifyUrl,
    m_payment_id: payment.id,
    amount: toTwoDecimals(opts.amount),
    item_name: opts.itemName,
  };

  const signature = generateSignature(params);

  const form: Record<string, string> = { ...params, signature };

  // PayFast expects POST form submission to their process URL.
  return {
    method: 'POST' as const,
    action: getBaseUrl(),
    form
  };
}

export async function verifyNotification(payload: Record<string, any>) {
  // payload should contain 'signature' and 'm_payment_id' and 'payment_status'
  const { signature, m_payment_id } = payload;
  if (!signature || !m_payment_id) throw new Error('Invalid notification payload');

  // compute expected signature
  const payloadCopy = { ...payload };
  delete payloadCopy.signature;

  const expected = generateSignature(payloadCopy);
  if (expected !== signature) throw new Error('Invalid signature');

  const statusRaw = String(payload.payment_status ?? '').toUpperCase();

  // Map PayFast statuses to PaymentStatus
  let status:PaymentStatus = PaymentStatus.FAILED;
  // PayFast 'COMPLETE' maps to our 'COMPLETED' enum value
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
