import { Router } from "express";
import { asyncHandlerMiddleware } from "../middleware/async-handler.middleware";
import {
    upsertVendorController,
    getVendorController,
    listVendorsController,
    deleteVendorController,
    checkVendorMembershipController,
    getVendorBySlugController,
} from "../controllers/vendor.controller";

const protectedVendorRouter = Router();
const publicVendorRouter = Router();

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
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: Optional UUID for existing vendor (include to update)
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *                 nullable: true
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - ACTIVE
 *                   - SUSPENDED
 *                   - DEACTIVATED
 *               ownerId:
 *                 type: string
 *                 description: Owner user id (foreign key)
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *             required:
 *               - name
 *               - slug
 *               - ownerId
 *           example:
 *             name: "Acme Supplies"
 *             slug: "acme-supplies"
 *             description: "Wholesale supplier of office goods."
 *             status: "PENDING"
 *             ownerId: "b3d5f0e2-7c4a-4f1a-9f2b-9a4e6d1c2e3f"
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

protectedVendorRouter.get('/vendor/:id/membership', asyncHandlerMiddleware(checkVendorMembershipController));

publicVendorRouter.get('/vendor/:slug', getVendorBySlugController);

export { protectedVendorRouter, publicVendorRouter };
