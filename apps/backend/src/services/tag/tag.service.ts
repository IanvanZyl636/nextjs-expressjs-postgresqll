import { TagUpsertArgs, TagWhereInput, PaginationParams } from "@nextjs-expressjs-postgresql/shared";
import { prisma } from "../../integrations/prisma";


export async function upsertTag(data: TagUpsertArgs) {
    return prisma().tag.upsert({
        ...data,
        include: { products: true },
    });
}

export async function getTagById(id: string) {
    return prisma().tag.findUnique({
        where: { id },
        include: { products: true },
    });
}

export async function listTags(params: PaginationParams = {}) {
    const { limit = 50, offset = 0, q } = params;

    const where: TagWhereInput | undefined = q ?
        {
            OR: [
                { name: { contains: q, mode: 'insensitive' } }
            ],
        } : undefined;

    const [items, total] = await Promise.all([
        prisma().tag.findMany({
            where,
            orderBy: { name: 'asc' },
            skip: offset,
            take: limit,
        }),
        prisma().tag.count({ where }),
    ]);

    return { items, total, limit, offset };
}

export async function deleteTag(id: string) {
    return prisma().tag.delete({
        where: { id },
    });
}
