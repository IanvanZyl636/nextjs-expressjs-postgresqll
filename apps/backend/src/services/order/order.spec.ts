import { prisma } from '../../integrations/prisma';
import { OrderViewModel, OrderUpsertSchema } from '@nextjs-expressjs-postgresql/shared/zod/Order.schema';
import { OrderService } from './order.service';

let customerId: string;
let shipmentId: string;
const variantId = '00000000-0000-0000-0000-000000000001';

beforeAll(async () => {
  await prisma().$connect();

  const customer = await prisma().customer.create({ data: { firstName: 'Order', surname: 'Tester', email: 'order-test@example.com' } });
  customerId = customer.id;

  const shippingMethod = await prisma().shippingMethod.create({ data: { name: 'TestShip', type: 'COLLECT' as any, flatPrice: 0 } });
  const shipment = await prisma().shipment.create({ data: { shippingMethodId: shippingMethod.id } });
  shipmentId = shipment.id;
});

describe('Upsert Order', () => {
  test('create order and adjust stock', async () => {
    // fetch variant and price
    const variant = await prisma().productVariant.findUnique({ where: { id: variantId } });
    expect(variant).toBeDefined();

    const startingStock = variant!.stock;

    const orderData: OrderViewModel = {
      status: 'PENDING' as any,
      customerId,
      shipmentId,
      orderItems: [
        { productVariantId: variantId, quantity: 1, price: variant!.price },
      ]
    };

    OrderUpsertSchema.parse(orderData);

    const result = await OrderService.upsertOrder(orderData);

    expect(result).toBeDefined();
    expect(Array.isArray(result.orderItems)).toBe(true);
    const updatedVariant = await prisma().productVariant.findUnique({ where: { id: variantId } });
    expect(updatedVariant!.stock).toBe(startingStock - 1);
  }, 50000);

  test('update order increases quantity and adjusts stock accordingly', async () => {
    // get an existing order made in previous test
    const orders = await prisma().order.findMany({ where: { customerId } });
    expect(orders.length).toBeGreaterThan(0);

    const order = orders[0];

    // fetch current variant stock
    const variantBefore = await prisma().productVariant.findUnique({ where: { id: variantId } });
    const beforeStock = variantBefore!.stock;

    const updatedOrderData: OrderViewModel = {
      id: order.id,
      status: order.status,
      customerId: order.customerId,
      shipmentId: order.shipmentId,
      orderItems: [
        { productVariantId: variantId, quantity: 2, price: variantBefore!.price },
      ]
    };

    OrderUpsertSchema.parse(updatedOrderData);

    const updated = await OrderService.upsertOrder(updatedOrderData);
    expect(updated).toBeDefined();
    const variantAfter = await prisma().productVariant.findUnique({ where: { id: variantId } });
    expect(variantAfter!.stock).toBe(beforeStock - 1); // increased by 1 more
  }, 50000);
});

afterAll(async () => {
  await prisma().$disconnect();
});
