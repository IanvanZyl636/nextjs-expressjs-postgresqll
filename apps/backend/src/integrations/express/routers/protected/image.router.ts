import { Router } from "express";
import { asyncHandler } from "../../middleware/async-handler.middleware";
import { uploadImagesController } from "../../controllers/protected/image.controller";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

/**
 * @swagger
 * /api/protected/upload-product-images:
 *   post:
 *     summary: Upload product images
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
 *                 description: Product image files to upload
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/upload-images', upload.array('images'), asyncHandler(uploadImagesController));

export default router;