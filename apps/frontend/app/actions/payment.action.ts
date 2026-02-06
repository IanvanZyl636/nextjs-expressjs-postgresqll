'use server'

import { ResponseModel } from "@nextjs-expressjs-postgresql/shared/models/response.model";
import requestHandler from "./helpers/request-handler.helper";
import { serverApiFetch } from "@/lib/api/server-api-client";
import z from "zod";

export async function processPayment(prevState: ResponseModel, formData: FormData) {
    return requestHandler(async () => {
        const { orderId } = Object.fromEntries(formData);

        if (!orderId) throw new Error('Order id is required');

        if (!z.string().uuid().safeParse(orderId).success) {
            throw new Error('Order id is not a valid UUID');
        }

        const res = await serverApiFetch(`/api/protected/payments/orders/${orderId}`, {
            forwardClientHeaders: true,
            method: "POST",            
            cache: 'no-cache'
        });        

        return res;
    });
}