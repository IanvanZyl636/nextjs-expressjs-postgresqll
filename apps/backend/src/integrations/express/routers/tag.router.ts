import { Router } from "express";
import { asyncHandlerMiddleware } from "../middleware/async-handler.middleware";
import {
    upsertTagController,
    getTagController,
    listTagsController,
    deleteTagController,
} from "../controllers/tag.controller";

const protectedTagRouter = Router();

/**
 * @swagger
 * /api/protected/tag/upsert:
 *   post:
 *     summary: Create or update a tag
 *     tags:
 *       - Tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagUpsertSchema'
 *     responses:
 *       200:
 *         description: Tag upserted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
protectedTagRouter.post('/tag/upsert', asyncHandlerMiddleware(upsertTagController));

/**
 * @swagger
 * /api/protected/tag/list:
 *   get:
 *     summary: List tags with pagination and optional search
 *     tags:
 *       - Tag
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
 *         description: List of tags
 *       401:
 *         description: Unauthorized
 */
protectedTagRouter.get('/tag/list', asyncHandlerMiddleware(listTagsController));

/**
 * @swagger
 * /api/protected/tag/{id}:
 *   get:
 *     summary: Get a tag by id
 *     tags:
 *       - Tag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tag details
 *       401:
 *         description: Unauthorized
 */
protectedTagRouter.get('/tag/:id', asyncHandlerMiddleware(getTagController));

/**
 * @swagger
 * /api/protected/tag/{id}:
 *   delete:
 *     summary: Delete a tag by id
 *     tags:
 *       - Tag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tag deleted
 *       401:
 *         description: Unauthorized
 */
protectedTagRouter.delete('/tag/:id', asyncHandlerMiddleware(deleteTagController));

export { protectedTagRouter };
