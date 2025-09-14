import { Response } from "express";
import { upsertVendor, getVendorById, listVendors, deleteVendor } from "../../../../services/vendor/vendor.service";
import { AuthenticatedRequest } from "../../models/authenticated-request.model";
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
