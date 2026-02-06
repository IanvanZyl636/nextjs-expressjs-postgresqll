import { prisma } from '../../integrations/prisma';
import { PaymentProvider, PaymentStatus } from '@nextjs-expressjs-postgresql/shared/prisma/enhance/enums';
import { getProvider } from './providers';
import HttpError from '../../utils/error/http-error';
import { OrderGetPayload } from '@nextjs-expressjs-postgresql/shared/prisma/generated/models';

export class PaymentService {
    static async getOrderCreatePayment(orderId: string) {
        const order = await prisma().order.findUnique({
            where: { id: orderId },
            include: { orderItems: true },
        });
        if (!order) throw new HttpError(404, 'Order not found');

        return this.createPaymentForOrder(order);
    }

    static async createPaymentForOrder(order: OrderGetPayload<{ include: { orderItems: true } }>, provider: PaymentProvider = PaymentProvider.PAYFAST) {
        const paymentData = {
            orderId: order.id,
            provider,
            amount: order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            currency: 'ZAR',
            status: PaymentStatus.PENDING,
        };

        const payment = await prisma().payment.upsert({
            where: { orderId: order.id },
            update: { ...paymentData },
            create: { ...paymentData }
        });

        const providerImpl = getProvider(provider);
        if (!providerImpl) throw new HttpError(500, 'Payment provider not implemented');

        const checkout = await providerImpl.createCheckout(payment, {
            amount: payment.amount,
            returnUrl: process.env.PAYFAST_RETURN_URL,
            cancelUrl: process.env.PAYFAST_CANCEL_URL,
            notifyUrl: process.env.PAYFAST_NOTIFY_URL,
            itemName: `Order ${order.id}`,
        });

        return { payment, checkout };
    }

    static async getPaymentByOrder(orderId: string) {
        return prisma().payment.findUnique({ where: { orderId } });
    }

    static async handleProviderNotification(
        provider: PaymentProvider, 
        payload: Record<string, any>,
        options?: { remoteAddress?: string; domain?:string, skipServerConfirmation?: boolean }
    ) {
        const providerImpl = getProvider(provider);
        if (!providerImpl) throw new HttpError(500, 'Payment provider not implemented');

        const verification = await providerImpl.verifyNotification(payload, options);

        const payment = await prisma().payment.findUnique({ where: { id: verification.paymentId } });
        if (!payment) throw new HttpError(400, 'Payment not found');

        // Security Check 3: Compare payment data (amount verification)
        const expectedAmount = payment.amount;
        const notificationAmount = parseFloat(payload.amount_gross || payload.amount || '0');
        
        if (Math.abs(expectedAmount - notificationAmount) > 0.01) {
            throw new HttpError(400, `Payment amount mismatch. Expected ${expectedAmount}, got ${notificationAmount}`);
        }

        const updated = await prisma().payment.update({
            where: { id: verification.paymentId },
            data: {
                status: verification.status,
                providerRef: verification.providerRef,
            }
        });

        return updated;
    }
}