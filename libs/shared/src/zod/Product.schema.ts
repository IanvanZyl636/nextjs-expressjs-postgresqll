import { z } from 'zod';
import { ProductCreateSchema } from '../prisma/enhance/zod/models/Product.schema';
import { ProductVariantCreateSchema } from '../prisma/enhance/zod/models/ProductVariant.schema';
import { ProductStatusSchema } from '../prisma/enhance/zod/enums/ProductStatus.schema';
import { MediaTypeSchema } from '../prisma/enhance/zod/enums/MediaType.schema';
import { ProductUpsertArgs, ProductVariantCreateWithoutProductInput, ProductVariantUpdateManyWithoutProductNestedInput } from '../prisma/enhance/models';

const MediaLinkSchema = z.object({
  id: z.string().uuid(),
  mediaType: MediaTypeSchema,
});

const VariantsSchema = ProductVariantCreateSchema.extend({
  id: z.string().uuid().optional(),
  productId: z.string().optional(),
});

export const DraftCreate = ProductCreateSchema.extend({
  id: z.string().uuid().optional(),
  status: z.literal(ProductStatusSchema.enum.DRAFT),
  productVariants: z.array(VariantsSchema.extend({
    mediaItems: z.array(MediaLinkSchema).optional()
  })).optional()
});

const requireImageOrVideo = (items: { mediaType: keyof typeof MediaTypeSchema.Enum }[], ctx: z.RefinementCtx) => {
  if (!items.some(m => ['Image', 'Video'].includes(m.mediaType))) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Must include at least one image or video",
      path: ["mediaItems"]
    });
  }
};

export const NonDraftCreate = ProductCreateSchema.extend({
  id: z.string().uuid().optional(),
  status: z.enum([ProductStatusSchema.enum.ACTIVE, ProductStatusSchema.enum.INACTIVE, ProductStatusSchema.enum.ARCHIVED]),
  name: z.string(),
  slug: z.string(),
  description: z.string().min(1, 'Description is required'),
  productVariants: z.array(VariantsSchema.extend({
    mediaItems: z.array(MediaLinkSchema).superRefine(requireImageOrVideo)
  }))
});

const ProductDiscriminatedWithRulesSchema = z.discriminatedUnion('status', [
  DraftCreate,
  NonDraftCreate,
]);

export const ProductWithRulesSchema = ProductDiscriminatedWithRulesSchema;

export type ProductViewModel = z.infer<typeof ProductWithRulesSchema>;

type VariantModel = NonNullable<ProductViewModel['productVariants']>[number];

const withMediaConnect = (variant: VariantModel): ProductVariantCreateWithoutProductInput => ({
  ...variant,
  mediaItems: variant.mediaItems
    ? {
      create: variant.mediaItems.map(({ id }, index) => ({      
        sortOrder: index,
        isPrimary: index === 0,
        media: {
          connect: { id }          
        }
      }))
    }
    : undefined,
});

function mapVariants(
  variants: VariantModel[],
  action: 'UPSERT'
): ProductVariantUpdateManyWithoutProductNestedInput['upsert'];

function mapVariants(
  variants: VariantModel[],
  action: 'CREATE'
): ProductVariantUpdateManyWithoutProductNestedInput['create'];

function mapVariants(
  variants: VariantModel[],
  action: 'UPSERT' | 'CREATE'
): ProductVariantUpdateManyWithoutProductNestedInput['upsert']
  | ProductVariantUpdateManyWithoutProductNestedInput['create'] {
  if (action === 'UPSERT') {
    return variants.map((variant) => ({
      where: { id: variant.id ?? '' },
      update: withMediaConnect(variant),
      create: withMediaConnect(variant),
    }));
  }

  if (action === 'CREATE') {
    return variants.map((variant) => withMediaConnect(variant));
  }

  throw new Error('Unsupported action');
}


export const ProductUpsertWithRulesSchema =
  ProductDiscriminatedWithRulesSchema.transform<ProductUpsertArgs>((product) => {
    const variantsUpsert = product.productVariants
      ? { upsert: mapVariants(product.productVariants, 'UPSERT') }
      : undefined;

    const variantsCreate = product.productVariants
      ? { create: mapVariants(product.productVariants, 'CREATE') }
      : undefined;

    return {
      where: { id: product.id ?? '' },
      update: { ...product, productVariants: variantsUpsert },
      create: { ...product, productVariants: variantsCreate },
    };
  }).pipe(z.custom<ProductUpsertArgs>());