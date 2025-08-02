import { Router } from "express";
import { asyncHandler } from "../../middleware/async-handler.middleware";
import { getUser } from "../../controllers/protected/user.controller";

const router = Router();

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
router.get('/user', asyncHandler(getUser));

export default router;