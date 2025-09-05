import { TagUpsertSchema, PaginationParams } from "@nextjs-expressjs-postgresql/shared";
import { Response } from "express";
import { upsertTag, getTagById, listTags, deleteTag } from "../../../../services/tag/tag.service";
import { AuthenticatedRequest } from "../../models/authenticated-request.model";

export async function upsertTagController(req: AuthenticatedRequest, res: Response) {
    const tag = TagUpsertSchema.parse(req.body);

    const result = await upsertTag(tag);

    return res.json(result);
}

export async function getTagController(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;

    const result = await getTagById(id);

    return res.json(result);
}

export async function listTagsController(req: AuthenticatedRequest, res: Response) {
    const params: PaginationParams = {
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
        q: req.query.q ? String(req.query.q) : undefined,
    };

    const result = await listTags(params);

    return res.json(result);
}

export async function deleteTagController(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;

    const result = await deleteTag(id);

    return res.json(result);
}
