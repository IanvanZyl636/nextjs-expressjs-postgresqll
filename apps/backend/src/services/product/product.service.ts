import { ProductUpsertArgs } from "@nextjs-expressjs-postgresql/shared";
import { prisma } from "../../integrations/prisma";

export async function upsertProduct(data: ProductUpsertArgs) {
  const product = await prisma().product.upsert({
    ...data,
    include: {
      tags: true,
      categories: true,
      productVariants: {
        include: {
          mediaItems: {
            include: {
              media: true
              },
            },
          },
        },
      },
    });   
  
  const mediaUpdates: string[] = [];

  for (const variant of product.productVariants) {
    for (const mediaItem of variant.mediaItems) {
      const ids = [mediaItem.mediaId];

      if (mediaItem.media.mediaType === "Image") {
        const children = await prisma().image.findMany({
          where: { parentId: mediaItem.mediaId },
          select: { id: true },
        });
        ids.push(...children.map(c => c.id));
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

export async function getProducts(options?: {
  skip?: number;
  take?: number;
  search?: string;
  status?: string;
}) {
  return prisma().product.findMany({
    skip: options?.skip,
    take: options?.take,
    where: {
      deletedAt: null,
      ...(options?.search
        ? { name: { contains: options.search, mode: 'insensitive' } }
        : {}),
      ...(options?.status ? { status: options.status as any } : {}),
    },
    include: {
      tags: true,
      categories: true,
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
      productVariants: {
        include: {
          mediaItems: {
            include: { media: true },
          },
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