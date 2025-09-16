import { Router } from "express";
import { asyncHandlerMiddleware } from "../middleware/async-handler.middleware";
import { mediaController, uploadImagesController } from "../controllers/media.controller";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const protectedMediaRouter = Router();
const publicMediaRouter = Router();

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


/**
 * @swagger
 * /api/media/{fileId}:
 *   get:
 *     summary: Retrieve an uploaded image by fileId
 *     tags:
 *       - Image
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to retrieve
 *     responses:
 *       200:
 *         description: Image file retrieved successfully
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Bad request (invalid filename)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 */
publicMediaRouter.get('/media/:fileId', asyncHandlerMiddleware(mediaController));

export { publicMediaRouter, protectedMediaRouter};