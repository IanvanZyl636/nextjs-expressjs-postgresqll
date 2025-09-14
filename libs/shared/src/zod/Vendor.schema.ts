import { z } from 'zod';
import { VendorCreateSchema } from '../prisma/enhance/zod/models/Vendor.schema';
import { VendorUpsertArgs } from '../prisma/enhance/logical-prisma-client/models/Vendor';

export const VendorModelSchema = VendorCreateSchema.extend({
    id: z.string().uuid().optional(),
});

export type VendorViewModel = z.infer<typeof VendorModelSchema>;

export const VendorUpsertSchema = VendorModelSchema
.transform<VendorUpsertArgs>(data => ({
    where: { id: data.id ?? '' },
    create: data,
    update: data,
}));
