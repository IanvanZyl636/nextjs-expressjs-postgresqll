
import { Response } from "express";
import { upsertRating, getRatingById, listRatings, deleteRating } from "../../../services/rating/rating.service";
import { AuthenticatedRequest } from "../models/authenticated-request.model";
import { RatingUpsertSchema } from "@nextjs-expressjs-postgresql/shared/zod/Rating.schema";
import { PaginationParams } from "@nextjs-expressjs-postgresql/shared/types/query.types";

export async function upsertRatingController(req: AuthenticatedRequest, res: Response) {
    const rating = RatingUpsertSchema.parse(req.body);

    const result = await upsertRating(rating);

    return res.json(result);
}

export async function getRatingController(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;

    const result = await getRatingById(id);

    return res.json(result);
}

export async function listRatingsController(req: AuthenticatedRequest, res: Response) {
    const params: PaginationParams = {
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
        q: req.query.q ? String(req.query.q) : undefined,
    };

    const result = await listRatings(params);

    return res.json(result);
}

export async function deleteRatingController(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;

    const result = await deleteRating(id);

    return res.json(result);
}
