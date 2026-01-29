import { createCheckout, verifyNotification } from './payfast.provider';
import { PaymentStatus } from '@nextjs-expressjs-postgresql/shared/prisma/enhance/enums';

beforeAll(() => {
  process.env.PAYFAST_MERCHANT_ID = '10000100';
  process.env.PAYFAST_MERCHANT_KEY = '46f0cd694581a';
  process.env.PAYFAST_PASSPHRASE = 'testpass';
  process.env.PAYFAST_SANDBOX = 'true';
});

test('createCheckout returns form with signature and expected fields', async () => {
  const payment = { id: 'pay-1' } as any;
  const checkout = await createCheckout(payment, { amount: 123.45, itemName: 'Test Order', returnUrl: 'https://r', cancelUrl: 'https://c', notifyUrl: 'https://n' });

  expect(checkout.method).toBe('POST');
  expect(checkout.action).toContain('payfast');
  expect(checkout.form.m_payment_id).toBe(payment.id);
  expect(checkout.form.amount).toBe('123.45');
  expect(checkout.form.signature).toMatch(/^[a-f0-9]{32}$/);
});

function computeSignatureForTest(payload: Record<string, any>) {
  // replicate test signature algorithm: sort keys, join k=v, append passphrase
  const passphrase = process.env.PAYFAST_PASSPHRASE;
  const keys = Object.keys(payload).filter(k => payload[k] !== undefined && payload[k] !== null).sort();
  const pieces: string[] = [];
  for (const k of keys) pieces.push(`${k}=${String(payload[k])}`);
  let str = pieces.join('&');
  if (passphrase) str = `${str}&passphrase=${passphrase}`;
  const crypto = require('crypto');
  return crypto.createHash('md5').update(str).digest('hex');
}

test('verifyNotification validates signature and maps statuses', async () => {
  const payload: Record<string, any> = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY,
    m_payment_id: 'pay-1',
    amount: '123.45',
    payment_status: 'COMPLETE',
    payfast_payment_id: 'pf_abc123'
  };

  payload.signature = computeSignatureForTest(payload);

  const result = await verifyNotification(payload);

  expect(result.paymentId).toBe('pay-1');
  expect(result.status).toBe(PaymentStatus.PAID);
  expect(result.providerRef).toBe('pf_abc123');
});
