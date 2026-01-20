import { prisma } from '../../integrations/prisma';
import { CartUpsertSchema, CartViewModel } from '@nextjs-expressjs-postgresql/shared/zod/Cart.schema';

export class CartService {
  static async upsertCart(data: CartViewModel) {
    for(let item of data?.cartItems ?? []) {
      const productVariant = await prisma().productVariant.findUnique({where: {id: item.productVariantId}});
      
      if(!productVariant) throw new Error(`Product variant with ID ${item.productVariantId} not found.`);          

      if(item.quantity > productVariant.stock) {
        throw new Error(`Quantity (${item.quantity}) cannot exceed available stock (${productVariant.stock}) for product variant ${productVariant.name}.`);
      }
    }    
    
    const cartUpsert = CartUpsertSchema.parse(data);

    return prisma().cart.upsert({
      ...cartUpsert,
      include: { cartItems: { include: { productVariant: true } } }
    });
  }

  static async getCartById(id: string) {
    return prisma().cart.findUnique({ where: { id }, include: { cartItems: true } });
  }  
}