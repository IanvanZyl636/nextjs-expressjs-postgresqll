import { z } from 'zod';
import { CustomerCreateSchema } from '../prisma/enhance/zod/models';
import { CustomerUpsertArgs } from '../prisma/enhance/models';

export const CustomerModelSchema = CustomerCreateSchema.extend({
  id: z.string().uuid().optional(),
});

export type CustomerViewModel = z.infer<typeof CustomerModelSchema>;

export const CustomerUpsertSchema = CustomerModelSchema.transform<CustomerUpsertArgs>(data => ({
  where: { id: data.id ?? '' },
  create: data,
  update: data,
}));
