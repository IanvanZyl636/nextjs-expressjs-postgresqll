import { Router } from "express";
import { asyncHandlerMiddleware } from "../middleware/async-handler.middleware";
import { getUser } from "../controllers/user.controller";

const protectedUserRouter = Router();

/**
 * @swagger
 * /api/protected/user:
 *   get:
 *     summary: Get current logged-in user
 *     security:
 *       - authorization: []
 *     responses:
 *       200:
 *         description: User info
 *       401:
 *         description: Unauthorized
 */
protectedUserRouter.get('/user', asyncHandlerMiddleware(getUser));

export { protectedUserRouter };