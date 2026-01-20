import { prisma } from '../../integrations/prisma';
import { CartViewModel, CartUpsertSchema } from '@nextjs-expressjs-postgresql/shared/zod/Cart.schema';
import { CartService } from './cart.service';

const cartData: CartViewModel = {  
  cartItems: [
    { productVariantId: '00000000-0000-0000-0000-000000000001', quantity: 1 },    
  ],
};

beforeAll(async () => {
  await prisma().$connect();
});

describe('Upsert Cart', () => {
  test('upsert cart happy path', async () => {
  CartUpsertSchema.parse(cartData);

  // call the service which will validate stock and upsert
  const result = await CartService.upsertCart(cartData);

    // basic assertion: result exists and has cartItems array
    expect(result).toBeDefined();
    expect(Array.isArray(result.cartItems)).toBe(true);
  }, 50000);
});

afterAll(async () => {
  await prisma().$disconnect();
});
