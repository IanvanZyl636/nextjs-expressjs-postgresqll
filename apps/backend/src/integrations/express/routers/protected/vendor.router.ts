import { Router } from "express";
import { asyncHandlerMiddleware } from "../../middleware/async-handler.middleware";
import {
    upsertVendorController,
    getVendorController,
    listVendorsController,
    deleteVendorController,
} from "../../controllers/protected/vendor.controller";

const protectedVendorRouter = Router();

/**
 * @swagger
 * /api/protected/vendor/upsert:
 *   post:
 *     summary: Create or update a vendor
 *     tags:
 *       - Vendor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendorUpsertSchema'
 *     responses:
 *       200:
 *         description: Vendor upserted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
protectedVendorRouter.post('/vendor/upsert', asyncHandlerMiddleware(upsertVendorController));

/**
 * @swagger
 * /api/protected/vendor/list:
 *   get:
 *     summary: List vendors with pagination and optional search
 *     tags:
 *       - Vendor
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
 *         description: List of vendors
 *       401:
 *         description: Unauthorized
 */
protectedVendorRouter.get('/vendor/list', asyncHandlerMiddleware(listVendorsController));

/**
 * @swagger
 * /api/protected/vendor/{id}:
 *   get:
 *     summary: Get a vendor by id
 *     tags:
 *       - Vendor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor details
 *       401:
 *         description: Unauthorized
 */
protectedVendorRouter.get('/vendor/:id', asyncHandlerMiddleware(getVendorController));

/**
 * @swagger
 * /api/protected/vendor/{id}:
 *   delete:
 *     summary: Delete a vendor by id
 *     tags:
 *       - Vendor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor deleted
 *       401:
 *         description: Unauthorized
 */
protectedVendorRouter.delete('/vendor/:id', asyncHandlerMiddleware(deleteVendorController));

export { protectedVendorRouter };
