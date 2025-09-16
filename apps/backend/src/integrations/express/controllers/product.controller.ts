import { ProductUpsertWithRulesSchema } from "@nextjs-expressjs-postgresql/shared/zod/Product.schema";
import { upsertProduct } from "../../../services/product/product.service"
import { AuthenticatedRequest } from "../models/authenticated-request.model"
import { Response } from "express";

export async function createProductController(
    req: AuthenticatedRequest,
    res: Response
){
    const product = ProductUpsertWithRulesSchema.parse(req.body);

    await upsertProduct(product);
}

export async function upsertProductController(
    req: AuthenticatedRequest,
    res: Response
) {
    const product = ProductUpsertWithRulesSchema.parse(req.body);    

    const result = await upsertProduct(product);

    return res.json(result);
}