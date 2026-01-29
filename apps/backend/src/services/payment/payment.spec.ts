// import { createPaymentForOrder } from './payment.service';

// jest.mock('../../integrations/prisma', () => ({
//   prisma: jest.fn(() => ({
//     payment: {
//       create: jest.fn().mockResolvedValue({ id: 'pay-1', orderId: 'ord-1', amount: 10, currency: 'ZAR', status: 'PENDING' }),
//       findUnique: jest.fn().mockResolvedValue(null),
//       update: jest.fn().mockResolvedValue({ id: 'pay-1', status: 'PAID' })
//     }
//   }))
// }));

// jest.mock('./providers', () => ({
//   getProvider: jest.fn(() => ({
//     createCheckout: jest.fn().mockResolvedValue({ method: 'POST', action: 'https://sandbox.payfast.co.za/eng/process', form: { some: 'value' } }),
//     verifyNotification: jest.fn()
//   }))
// }));

// describe('payment.service', () => {
//   test('createPaymentForOrder creates payment and returns checkout', async () => {
//     const result = await createPaymentForOrder({ orderId: 'ord-1', userId: 'user-1', amount: 10, provider: undefined });

//     expect(result.payment).toBeDefined();
//     expect(result.payment.id).toBe('pay-1');
//     expect(result.checkout).toBeDefined();
//     expect(result.checkout.action).toContain('payfast');
//   });
// });
