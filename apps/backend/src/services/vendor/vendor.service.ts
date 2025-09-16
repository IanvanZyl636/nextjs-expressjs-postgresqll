import { prisma } from "../../integrations/prisma";
import { PaginationParams } from "@nextjs-expressjs-postgresql/shared/types/query.types";

export async function upsertVendor(data: any) {
    return prisma().vendor.upsert({
        ...data,
        include: { users: { include: { user: true } }, products: true },
    });
}

export async function getVendorById(id: string) {
    return prisma().vendor.findUnique({
        where: { id },
        include: { users: { include: { user: true } }, products: true },
    });
}

export async function listVendors(params: PaginationParams = {}) {
    const { limit = 50, offset = 0, q } = params;

    const where: any | undefined = q ?
        {
            OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { slug: { contains: q, mode: 'insensitive' } }
            ],
        } : undefined;

    const [items, total] = await Promise.all([
        prisma().vendor.findMany({
            where,
            orderBy: { name: 'asc' },
            skip: offset,
            take: limit,
        }),
        prisma().vendor.count({ where }),
    ]);

    return { items, total, limit, offset };
}

export async function deleteVendor(id: string) {
    return prisma().vendor.delete({
        where: { id },
    });
}

export async function isUserMember(vendorId: string, userId: string) {
    const member = await prisma().vendorUser.findFirst({ where: { vendorId, userId } });
    return !!member;
}

export async function getUserMembership(vendorId: string, userId: string) {
    return prisma().vendorUser.findFirst({ where: { vendorId, userId } });
}
