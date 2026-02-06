import { Router } from 'express';
import { asyncHandlerMiddleware } from '../middleware/async-handler.middleware';
import { createOrderPaymentController, handlePayFastNotificationController } from '../controllers/payment.controller';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const protectedPaymentRouter = Router();
const publicPaymentRouter = Router();

/**
 * @swagger
 * /api/protected/payments/orders/{orderId}:
 *   post:
 *     summary: Create a payment/checkout for an order
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provider:
 *                 type: string
 *                 example: PAYFAST
 *     responses:
 *       201:
 *         description: Payment created and checkout returned
 */
protectedPaymentRouter.post('/payments/orders/:orderId', asyncHandlerMiddleware(createOrderPaymentController));

/**
 * @swagger
 * /api/payments/payfast/notify:
 *   post:
 *     summary: PayFast Instant Payment Notification (IPN) webhook endpoint
 *     description: Receives payment notifications from PayFast with security verification
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - m_payment_id
 *               - payment_status
 *               - signature
 *             properties:
 *               m_payment_id:
 *                 type: string
 *                 description: Payment ID
 *               payment_status:
 *                 type: string
 *                 enum: [PAID, FAILED, CANCELLED, REFUNDED]
 *               amount_gross:
 *                 type: number
 *               signature:
 *                 type: string
 *               payfast_payment_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification processed successfully
 *       400:
 *         description: Invalid notification or security check failed
 */
publicPaymentRouter.post('/payments/payfast/notify', upload.none(), asyncHandlerMiddleware(handlePayFastNotificationController));

export { protectedPaymentRouter, publicPaymentRouter };
