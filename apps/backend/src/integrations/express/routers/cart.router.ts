import { Router } from 'express';

import { asyncHandlerMiddleware } from '../middleware/async-handler.middleware';
import { upsertCategoryController } from '../controllers/category.controller';
import { getCart } from '../controllers/cart.controller';

const router = Router();

// Create cart - can be guest or authenticated
router.post('/', asyncHandlerMiddleware(upsertCategoryController));

// Get cart by id (public)
router.get('/:id', asyncHandlerMiddleware(getCart));

export default router;
