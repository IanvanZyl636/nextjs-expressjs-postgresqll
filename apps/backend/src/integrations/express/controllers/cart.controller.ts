import { Request, Response } from 'express';
import { CartService } from '../../../services/cart/cart.service';
import { AuthenticatedRequest } from '../models/authenticated-request.model';
import { CartUpsertSchema } from '@nextjs-expressjs-postgresql/shared/zod/Cart.schema';

export async function upsertCategoryController(req: AuthenticatedRequest, res: Response) {    
    CartUpsertSchema.parse(req.body);

    const result = await CartService.upsertCart(req.body);

    return res.json(result);
}

export const getCart = async (req: Request, res: Response) => {
    const id = req.params.id;
    const cart = await CartService.getCartById(id);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    return res.json(cart);
};
