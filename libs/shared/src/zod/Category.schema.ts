

import { CategoryUpsertArgs } from '../prisma/enhance/logical-prisma-client/models/Category';
import { CategoryCreateSchema } from '../prisma/enhance/zod/models/Category.schema';
import { z } from 'zod';

export const CategoryModelSchema = CategoryCreateSchema.extend({
    id: z.string().uuid().optional(),
});

export type CategoryViewModel = z.infer<typeof CategoryModelSchema>;

export const CategoryUpsertSchema = CategoryModelSchema
.transform<CategoryUpsertArgs>(data => ({
    where: { id: data.id ?? '' },
    create: data,
    update: data,
}));