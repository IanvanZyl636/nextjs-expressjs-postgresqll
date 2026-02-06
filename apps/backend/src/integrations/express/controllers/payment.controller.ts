import { Request, Response } from 'express';
import { PaymentService } from '../../../services/payment/payment.service';
import { createResponse } from '../helpers/create-reponse';
import HttpError from '../../../utils/error/http-error';
import z from 'zod';
import { PaymentProvider } from '@nextjs-expressjs-postgresql/shared/prisma/enhance/enums';
import { getRequestDomain, getRequestIpUserAgent } from '../util';

export const createOrderPaymentController = async (
  req: Request,
  res: Response
) => {
  const { orderId } = req.params;

  if (!orderId) throw new HttpError(400, 'Order id is required');

  if(!z.string().uuid().safeParse(req.params.orderId).success) {
    throw new HttpError(400, 'Order id is not a valid UUID');
  }

  const result = await PaymentService.getOrderCreatePayment(orderId);

  return res.status(201).json(createResponse('success', result, 'Payment created'));
};

export const handlePayFastNotificationController = async (
  req: Request,
  res: Response
) => {  
  try{
    const {ip: remoteAddress } = getRequestIpUserAgent(req);
    const domain = getRequestDomain(req);
    
    const updated = await PaymentService.handleProviderNotification(
      PaymentProvider.PAYFAST,
      req.body,
      { remoteAddress, domain }
    );
    
    res.status(200).json(
      createResponse('success', { paymentId: updated.id }, 'Notification processed')
    );
  } catch (error) {
    // Log the error but still return 200 to prevent PayFast from retrying
    console.error('PayFast notification processing error:', error);
    
    // Return 200 but log that there was an issue
    res.status(500).json(
      createResponse('error', null, 'Notification acknowledged with error')
    );
  }
};
