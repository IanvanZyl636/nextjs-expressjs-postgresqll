import { Router } from "express";
import { asyncHandlerMiddleware } from "../middleware/async-handler.middleware";
import {
    upsertCategoryController,
    getCategoryController,
    listCategoriesController,
    deleteCategoryController,
} from "../controllers/category.controller";

const protectedCategoryRouter = Router();

/**
 * @swagger
 * /api/protected/category/upsert:
 *   post:
 *     summary: Create or update a category
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryUpsertSchema'
 *     responses:
 *       200:
 *         description: Category upserted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
protectedCategoryRouter.post('/category/upsert', asyncHandlerMiddleware(upsertCategoryController));

/**
 * @swagger
 * /api/protected/category/list:
 *   get:
 *     summary: List categories with pagination and optional search
 *     tags:
 *       - Category
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of categories
 *       401:
 *         description: Unauthorized
 */
protectedCategoryRouter.get('/category/list', asyncHandlerMiddleware(listCategoriesController));

/**
 * @swagger
 * /api/protected/category/{id}:
 *   get:
 *     summary: Get a category by id
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *       401:
 *         description: Unauthorized
 */
protectedCategoryRouter.get('/category/:id', asyncHandlerMiddleware(getCategoryController));

/**
 * @swagger
 * /api/protected/category/{id}:
 *   delete:
 *     summary: Delete a category by id
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 *       401:
 *         description: Unauthorized
 */
protectedCategoryRouter.delete('/category/:id', asyncHandlerMiddleware(deleteCategoryController));

export { protectedCategoryRouter };
