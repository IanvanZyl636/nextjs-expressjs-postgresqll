

import { ProductUpsertArgs } from "@nextjs-expressjs-postgresql/shared/prisma/enhance/models";
import { prisma } from "../../integrations/prisma";
import { ProductQueryParams } from "@nextjs-expressjs-postgresql/shared/types/query.types";

export async function upsertProduct(data: ProductUpsertArgs) {
  const product = await prisma().product.upsert({
    ...data,
    include: {
      tags: true,
      categories: true,
      productVariants: {
        include: {
          galleryMedia: {
            include: {
              media: {
                include: {
                  image: { include: { children: true } },
                  video: true,

                }
              }
            },
          },
          attachments: {
            include: {
              media: {
                include: {
                  audio: true,
                  document: true,
                  file: true,
                }
              }
            }
          }
        },
      },
    },
  });

  const mediaUpdates: string[] = [];

  for (const variant of product.productVariants) {
    for (const mediaItem of variant.galleryMedia) {
      const ids = [mediaItem.mediaId];

      if (mediaItem.media.mediaType === "Image" && mediaItem.media.image) {
        ids.push(...mediaItem.media.image.children.map(c => c.id));
      }

      mediaUpdates.push(...ids);
    }
  }

  if (mediaUpdates.length > 0) {
    await prisma().media.updateMany({
      where: { id: { in: mediaUpdates } },
      data: { isStale: false },
    });
  }

  return product;
}

export async function getProducts(params: ProductQueryParams = {}) {  
  const { limit = 50, offset = 0, q } = params;

  return prisma().product.findMany({
    skip: offset,
    take: limit,
    where: {
      deletedAt: null,
      ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
      ...(params?.status ? { status: params.status } : {}),
    },
    include: {
      tags: true,
      categories: true,
      vendor: true,
      productVariants: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProductById(id: string) {
  return prisma().product.findUnique({
    where: { id },
    include: {
      tags: true,
      categories: true,
      vendor: true,
      productVariants: {
        include: {
          galleryMedia: {
            include: {
              media: {
                include: {
                  image: { include: { children: true } }
                }
              }
            },
          },
          attachments: true
        },
      },
    },
  });
}

export async function deleteProduct(id: string, softDelete = true) {
  if (softDelete) {
    return prisma().product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  } else {
    return prisma().product.delete({
      where: { id },
    });
  }
}