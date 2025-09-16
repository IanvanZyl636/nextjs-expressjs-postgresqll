import { Request, Response } from "express";
import { upsertVendor, getVendorById, listVendors, deleteVendor } from "../../../services/vendor/vendor.service";
import { AuthenticatedRequest } from "../models/authenticated-request.model";
import { isUserMember } from "../../../services/vendor/vendor.service";
import { prisma } from "../../prisma";
import { PaginationParams } from "@nextjs-expressjs-postgresql/shared/types/query.types";
import { VendorUpsertSchema } from "@nextjs-expressjs-postgresql/shared/zod/Vendor.schema";

export async function upsertVendorController(req: AuthenticatedRequest, res: Response) {
    const vendor = VendorUpsertSchema.parse(req.body);

    const result = await upsertVendor(vendor);

    return res.json(result);
}

export async function getVendorController(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;

    const result = await getVendorById(id);

    return res.json(result);
}

export async function listVendorsController(req: AuthenticatedRequest, res: Response) {
    const params: PaginationParams = {
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
        q: req.query.q ? String(req.query.q) : undefined,
    };

    const result = await listVendors(params);

    return res.json(result);
}

export async function deleteVendorController(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;

    const result = await deleteVendor(id);

    return res.json(result);
}

export async function checkVendorMembershipController(req: AuthenticatedRequest, res: Response) {
        const { id } = req.params;

        let vendorId = id;
        if (id && id.length && id.indexOf('-') === -1) {
            // rough heuristic: if param has no hyphen, treat as slug (slugs usually have no hyphens in this app)
            const vendor = await prisma().vendor.findUnique({ where: { slug: id } });
            if (!vendor) return res.status(404).json({ isMember: false });
            vendorId = vendor.id;
        }

        const userId = req.userId;
        if (!userId) return res.status(401).json({ isMember: false });

        const isMemberRes = await isUserMember(vendorId, userId);

        return res.json({ isMember: isMemberRes });
}

export async function getVendorBySlugController(req: Request, res: Response) {
  const { slug } = req.params;

  const vendor = await prisma().vendor.findUnique({
    where: { slug },
    include: { products: true }
  });

  if (!vendor) return res.status(404).json({ error: 'Not found' });

  return res.json(vendor);
}