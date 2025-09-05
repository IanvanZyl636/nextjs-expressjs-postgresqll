import { Router } from "express";
import { asyncHandlerMiddleware } from "../../middleware/async-handler.middleware";
import {
    upsertRatingController,
    getRatingController,
    listRatingsController,
    deleteRatingController,
} from "../../controllers/protected/rating.controller";

const protectedRatingRouter = Router();

/**
 * @swagger
 * /api/protected/rating/upsert:
 *   post:
 *     summary: Create or update a rating
 *     tags:
 *       - Rating
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RatingUpsertSchema'
 *     responses:
 *       200:
 *         description: Rating upserted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
protectedRatingRouter.post('/rating/upsert', asyncHandlerMiddleware(upsertRatingController));

/**
 * @swagger
 * /api/protected/rating/list:
 *   get:
 *     summary: List ratings with pagination and optional search
 *     tags:
 *       - Rating
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
 *         description: List of ratings
 *       401:
 *         description: Unauthorized
 */
protectedRatingRouter.get('/rating/list', asyncHandlerMiddleware(listRatingsController));

/**
 * @swagger
 * /api/protected/rating/{id}:
 *   get:
 *     summary: Get a rating by id
 *     tags:
 *       - Rating
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating details
 *       401:
 *         description: Unauthorized
 */
protectedRatingRouter.get('/rating/:id', asyncHandlerMiddleware(getRatingController));

/**
 * @swagger
 * /api/protected/rating/{id}:
 *   delete:
 *     summary: Delete a rating by id
 *     tags:
 *       - Rating
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating deleted
 *       401:
 *         description: Unauthorized
 */
protectedRatingRouter.delete('/rating/:id', asyncHandlerMiddleware(deleteRatingController));

export { protectedRatingRouter };
