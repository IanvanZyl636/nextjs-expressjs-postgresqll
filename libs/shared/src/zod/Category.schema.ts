import { CategoryCreateSchema, CategoryUpsertArgs } from "../prisma";
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