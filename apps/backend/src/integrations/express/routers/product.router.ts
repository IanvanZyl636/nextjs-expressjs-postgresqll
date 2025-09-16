import { Router } from "express";
import { asyncHandlerMiddleware } from "../middleware/async-handler.middleware";
import { createProductController, upsertProductController } from "../controllers/product.controller";

const protectedProductRouter = Router();

/**
 * @swagger
 * /api/protected/create:
 *   get:
 *     summary: Create a new product
 *     tags:
 *       - Product
 *     responses:
 *       200:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
protectedProductRouter.get('/create', asyncHandlerMiddleware(createProductController));

/**
 * POST /product/upsert - upsert a product (create or update)
 */
protectedProductRouter.post('/product/upsert', asyncHandlerMiddleware(upsertProductController));

export { protectedProductRouter };
