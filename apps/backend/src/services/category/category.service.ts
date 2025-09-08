
import { CategoryUpsertArgs, CategoryWhereInput } from "@nextjs-expressjs-postgresql/shared/prisma/enhance/models";
import { prisma } from "../../integrations/prisma";
import { PaginationParams } from "@nextjs-expressjs-postgresql/shared/types/query.types";


export async function upsertCategory(data: CategoryUpsertArgs) {
    return prisma().category.upsert({
        ...data,
        include: { children: true },
    });
}

export async function getCategoryById(id: string) {
    return prisma().category.findUnique({
        where: { id },
        include: { children: true },
    });
}

export async function listCategories(params: PaginationParams = {}) {
    const { limit = 50, offset = 0, q } = params;

    const where: CategoryWhereInput | undefined = q ?
        {
            OR: [
                { name: { contains: q, mode: 'insensitive' } }
            ],
        } : undefined;

    const [items, total] = await Promise.all([
        prisma().category.findMany({
            where,
            orderBy: { name: 'asc' },
            skip: offset,
            take: limit,
        }),
        prisma().category.count({ where }),
    ]);

    return { items, total, limit, offset };
}

export async function deleteCategory(id: string) {
    return prisma().category.delete({
        where: { id },
    });
}