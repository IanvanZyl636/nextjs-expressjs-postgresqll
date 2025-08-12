import { Router } from "express";
import { asyncHandlerMiddleware } from "../../middleware/async-handler.middleware";
import { uploadImagesController } from "../../controllers/protected/media.controller";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const protectedMediaRouter = Router();

/**
 * @swagger
 * /api/protected/upload-images:
 *   post:
 *     summary: Upload images
 *     tags:
 *       - Image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:               
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files to upload
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
protectedMediaRouter.post('/upload-images', upload.array('images'), asyncHandlerMiddleware(uploadImagesController));

export { protectedMediaRouter };