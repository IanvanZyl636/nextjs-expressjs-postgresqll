import { z } from 'zod';
import { CartCreateSchema, CartItemCreateSchema } from '../prisma/enhance/zod/models';
import { CartUpsertArgs } from '../prisma/enhance/models';

export const CartItemModelSchema = CartItemCreateSchema.extend({
    id: z.string().uuid().optional(),
    productVariantId: z.string().uuid(),
    cartId: z.string().uuid().optional(),
    quantity: z.number().min(1),
});

export const CartModelSchema = CartCreateSchema.extend({
    id: z.string().uuid().optional(),
    cartItems: z.array(CartItemModelSchema).optional(),
});

export type CartViewModel = z.infer<typeof CartModelSchema>;

export const CartUpsertSchema = CartModelSchema
    .transform<CartUpsertArgs>(data => {
        const { cartItems, ...rest } = data;

        return {
            where: { id: data.id ?? '' },
            create: {
                ...rest,
                cartItems: {
                    create: cartItems?.map(item => ({
                        quantity: item.quantity,
                        productVariant: {
                            connect: { id: item.productVariantId }
                        }
                    }))
                }
            },
            update: {
                ...rest,
                cartItems: {
                    upsert: cartItems?.map(item => ({
                        where: { id: item.id ?? '' },
                        create: {
                            quantity: item.quantity,
                            productVariant: {
                                connect: { id: item.productVariantId }
                            }
                        },
                        update: {
                            quantity: item.quantity,
                            productVariant: {
                                connect: { id: item.productVariantId }
                            }
                        },
                    })),
                },
            }
        }
    });