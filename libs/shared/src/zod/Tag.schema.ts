import { TagUpsertArgs } from '../prisma/enhance/logical-prisma-client/models/Tag';
import { TagCreateSchema } from '../prisma/enhance/zod/models/Tag.schema';
import { z } from 'zod';

export const TagModelSchema = TagCreateSchema.extend({
    id: z.string().uuid().optional(),
});

export type TagViewModel = z.infer<typeof TagModelSchema>;

export const TagUpsertSchema = TagModelSchema
.transform<TagUpsertArgs>(data => ({
    where: { id: data.id ?? '' },
    create: data,
    update: data,
}));
