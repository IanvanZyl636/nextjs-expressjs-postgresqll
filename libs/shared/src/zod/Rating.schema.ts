import { RatingCreateSchema, RatingUpsertArgs } from "../prisma";
import { z } from 'zod';

export const RatingModelSchema = RatingCreateSchema.extend({
    id: z.string().uuid().optional(),
});

export type RatingViewModel = z.infer<typeof RatingModelSchema>;

export const RatingUpsertSchema = RatingModelSchema
.transform<RatingUpsertArgs>(data => ({
    where: { id: data.id ?? '' },
    create: data,
    update: data,
}));
