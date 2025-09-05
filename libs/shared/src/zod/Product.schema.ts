import { z } from 'zod';
import { ProductCreateSchema } from '../prisma/enhance/zod/models/Product.schema';
import { ProductVariantCreateSchema } from '../prisma/enhance/zod/models/ProductVariant.schema';
import { ProductStatusSchema } from '../prisma/enhance/zod/enums/ProductStatus.schema';
import { MediaTypeSchema } from '../prisma/enhance/zod/enums/MediaType.schema';
import { ProductUpsertArgs, ProductVariantCreateWithoutProductInput, ProductVariantUpdateManyWithoutProductNestedInput } from '../prisma/enhance/models';

const mediaTypes = MediaTypeSchema.Values;

const GalleryMediaSchema = z.object({
  id: z.string().uuid(),
  mediaType: z.enum([mediaTypes.Image, mediaTypes.Video]),
});

const EntityLinkSchema = z.object({
  id: z.string().uuid(),
});

const AttachmentSchema = z.object({
  id: z.string().uuid(),
  mediaType: z.enum([mediaTypes.Audio, mediaTypes.Document, mediaTypes.File]),
});

const VariantsSchema = ProductVariantCreateSchema.extend({
  id: z.string().uuid().optional(),
  productId: z.string().optional(),
});

export const DraftCreate = ProductCreateSchema.extend({
  id: z.string().uuid().optional(),
  status: z.literal(ProductStatusSchema.enum.DRAFT),
  categories: z.array(EntityLinkSchema).optional(),
  tags: z.array(EntityLinkSchema).optional(),
  productVariants: z.array(VariantsSchema.extend({
    galleryMedia: z.array(GalleryMediaSchema),
    attachments: z.array(AttachmentSchema).optional()
  })).optional()
});

export const NonDraftCreate = ProductCreateSchema.extend({
  id: z.string().uuid().optional(),
  status: z.enum([ProductStatusSchema.enum.ACTIVE, ProductStatusSchema.enum.INACTIVE, ProductStatusSchema.enum.ARCHIVED]),
  name: z.string(),
  slug: z.string(),
  description: z.string().min(1, 'Description is required'),
  categories: z.array(EntityLinkSchema).nonempty('At least one category is required'),
  tags: z.array(EntityLinkSchema).nonempty('At least one tag is required'),
  productVariants: z.array(VariantsSchema.extend({
    galleryMedia: z.array(GalleryMediaSchema).nonempty({ message: "Gallery must contain at least one image or video" }),
    attachments: z.array(AttachmentSchema).optional()
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
  galleryMedia: variant.galleryMedia
    ? {
      create: variant.galleryMedia.map(({ id }, index) => ({      
        sortOrder: index,
        isPrimary: index === 0,
        media: {
          connect: { id }          
        }
      }))
    }
    : undefined,
  attachments: variant.attachments
    ? {
      create: variant.attachments.map(({ id }, index) => ({      
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

    const productCreate = {
      ...product,
      categories: { connect: product.categories?.map((category) => ({ id: category.id })) },
      tags: { connect: product.tags?.map((tag) => ({ id: tag.id })) }
    };

    return {
      where: { id: product.id ?? '' },
      update: { ...productCreate, productVariants: variantsUpsert },
      create: { ...productCreate, productVariants: variantsCreate },
    };
  }).pipe(z.custom<ProductUpsertArgs>());