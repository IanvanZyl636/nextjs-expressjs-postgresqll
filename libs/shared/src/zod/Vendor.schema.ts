import { z } from 'zod';
import { VendorCreateSchema } from '../prisma/enhance/zod/models/Vendor.schema';
import { VendorUpsertArgs } from '../prisma/enhance/logical-prisma-client/models/Vendor';
import { VendorUserRole } from '../prisma/enhance/enums';
import { VendorUserCreateSchema } from '../prisma/enhance/zod/models';

const VendorUserSchema = VendorUserCreateSchema.extend({
    id: z.string().uuid().optional(),
    vendorId: z.string().uuid().optional(),
})

const VendorModelSchema = VendorCreateSchema.extend({
    id: z.string().uuid().optional(),
    users: z.array(VendorUserSchema)
        .nonempty({ message: "Vendor must contain at least one user" })
        .refine(
            (users) => users.filter(u => u.role === VendorUserRole.OWNER).length === 1,
            {
                message: "There must be exactly one user with role OWNER",
            }
        ),
});

export type VendorViewModel = z.infer<typeof VendorModelSchema>;

export const VendorUpsertSchema = VendorModelSchema
    .transform<VendorUpsertArgs>(data => {
        const { users, ...rest } = data;

        return {
            where: { id: data.id ?? '' },
            create: {
                ...rest,
                users: {
                    create: users
                }
            },
            update: {
                ...rest,
                users: {
                    upsert: users.map(user => ({
                        where: { id: user.id ?? '' },
                        create: user,
                        update: user
                    }))
                }
            },
        }
    });
