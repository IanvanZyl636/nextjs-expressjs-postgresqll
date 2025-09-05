import { CategoryUpsertSchema, PaginationParams } from "@nextjs-expressjs-postgresql/shared";
import { Response } from "express";
import { upsertCategory, getCategoryById, listCategories, deleteCategory } from "../../../../services/category/category.service";
import { AuthenticatedRequest } from "../../models/authenticated-request.model";

export async function upsertCategoryController(req: AuthenticatedRequest, res: Response) {    
    const category = CategoryUpsertSchema.parse(req.body);

    const result = await upsertCategory(category);

    return res.json(result);
}

export async function getCategoryController(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;

    const result = await getCategoryById(id);

    return res.json(result);
}

export async function listCategoriesController(req: AuthenticatedRequest, res: Response) {
    const params: PaginationParams = {
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
        q: req.query.q ? String(req.query.q) : undefined,
    };

    const result = await listCategories(params);

    return res.json(result);
}

export async function deleteCategoryController(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;

    const result = await deleteCategory(id);

    return res.json(result);
}
