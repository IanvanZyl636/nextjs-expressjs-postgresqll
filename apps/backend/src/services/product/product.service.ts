import { Prisma } from "@nextjs-expressjs-postgresql/shared";
import { prisma } from "../../integrations/prisma";

export async function upsertProduct(
  data: Prisma.ProductUpsertArgs
) {
  return prisma().product.upsert({
    ...data,
    include: {
      tags: true,
      categories: true,
      productVariants: true,
    },
  });
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