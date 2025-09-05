import { PaginationParams, RatingUpsertArgs, RatingWhereInput } from "@nextjs-expressjs-postgresql/shared";
import { prisma } from "../../integrations/prisma";


export async function upsertRating(data: RatingUpsertArgs) {
    return prisma().rating.upsert({
        ...data,
        include: { product: true, user: true },
    });
}

export async function getRatingById(id: string) {
    return prisma().rating.findUnique({
        where: { id },
        include: { product: true, user: true },
    });
}

export async function listRatings(params: PaginationParams = {}) {
    const { limit = 50, offset = 0, q } = params;

    const where: RatingWhereInput | undefined = q ?
        {
            OR: [
                { review: { contains: q, mode: 'insensitive' } }
            ],
        } : undefined;

    const [items, total] = await Promise.all([
        prisma().rating.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
        }),
        prisma().rating.count({ where }),
    ]);

    return { items, total, limit, offset };
}

export async function deleteRating(id: string) {
    return prisma().rating.delete({
        where: { id },
    });
}
