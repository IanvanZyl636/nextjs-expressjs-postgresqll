import { z } from 'zod';
import { ProductCreateSchema } from '../prisma/enhance/zod/models/Product.schema';
import { ProductVariantCreateSchema } from '../prisma/enhance/zod/models/ProductVariant.schema';
import { ProductStatusSchema } from '../prisma/enhance/zod/enums/ProductStatus.schema';

const VariantsSchema = z.array(ProductVariantCreateSchema.extend({
  id: z.string().optional(),
  productId: z.string().optional()
}))

export const DraftCreate = ProductCreateSchema.extend({
  id: z.string().optional(),
  status: z.literal(ProductStatusSchema.enum.DRAFT),
  productVariants: VariantsSchema
});

export const NonDraftCreate = ProductCreateSchema.extend({
  id: z.string().optional(),
  status: z.enum([ProductStatusSchema.enum.ACTIVE, ProductStatusSchema.enum.INACTIVE, ProductStatusSchema.enum.ARCHIVED]),
  name: z.string(),
  slug: z.string(),
  description: z.string().min(1, 'Description is required'),
  productVariants: VariantsSchema.nonempty('At least one product variant is required')
});

const ProductDiscriminatedWithRulesSchema = z.discriminatedUnion('status', [
  DraftCreate,
  NonDraftCreate,
]);

export const ProductWithRulesSchema = ProductDiscriminatedWithRulesSchema;

export type ProductModel = z.infer<typeof ProductWithRulesSchema>;

export const ProductUpsertWithRulesSchema = ProductDiscriminatedWithRulesSchema
  .transform((product) => ({
    where: { id: product.id ?? '' },
    update: {
      ...product,
      productVariants: product.productVariants
        ? {
          upsert: product.productVariants.map((variant) => ({
            where: { id: variant.id ?? '' },
            update: variant,
            create: variant,
          })),
        }
        : undefined,
    },
    create: {
      ...product,
      productVariants: product.productVariants
        ? { create: product.productVariants }
        : undefined,
    }
  }));