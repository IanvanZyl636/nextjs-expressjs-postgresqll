import { z } from 'zod';
import { OrderCreateSchema, OrderItemCreateSchema } from '../prisma/enhance/zod/models';
import { OrderUpsertArgs } from '../prisma/enhance/models';

export const OrderItemModelSchema = OrderItemCreateSchema.extend({
  id: z.string().uuid().optional(),
  productVariantId: z.string().uuid(),
  orderId: z.string().uuid().optional(),
  quantity: z.number().min(1),
  price: z.number().min(0),
});

export const OrderModelSchema = OrderCreateSchema.extend({
  id: z.string().uuid().optional(),
  orderItems: z.array(OrderItemModelSchema).optional(),
});

export type OrderViewModel = z.infer<typeof OrderModelSchema>;

export const OrderUpsertSchema = OrderModelSchema.transform<OrderUpsertArgs>(data => {
  const { orderItems, ...rest } = data;

  return {
    where: { id: data.id ?? '' },
    create: {
      ...rest,
      orderItems: {
        create: orderItems?.map(item => ({
          quantity: item.quantity,
          price: item.price,
          productVariant: {
            connect: { id: item.productVariantId }
          }
        }))
      }
    },
    update: {
      ...rest,
      orderItems: {
        upsert: orderItems?.map(item => ({
          where: { id: item.id ?? '' },
          create: {
            quantity: item.quantity,
            price: item.price,
            productVariant: {
              connect: { id: item.productVariantId }
            }
          },
          update: {
            quantity: item.quantity,
            price: item.price,
            productVariant: {
              connect: { id: item.productVariantId }
            }
          }
        }))
      }
    }
  };
});
