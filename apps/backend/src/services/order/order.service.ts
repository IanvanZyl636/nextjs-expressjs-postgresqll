import { prisma } from '../../integrations/prisma';
import { OrderUpsertSchema, OrderViewModel } from '@nextjs-expressjs-postgresql/shared/zod/Order.schema';

export class OrderService {
  static async upsertOrder(data: OrderViewModel) {
    // Validate input (and transform to Prisma args)
    const orderUpsert = OrderUpsertSchema.parse(data);

    // Pre-check: validate product variants and stock constraints
    const items = data.orderItems ?? [];

    // Build a map of requested quantities by variant for quick lookup
    const requestedByVariant = new Map<string, number>();
    for (const it of items) {
      requestedByVariant.set(it.productVariantId, (requestedByVariant.get(it.productVariantId) ?? 0) + it.quantity);
    }

    // Fetch current variants and validate existence + stock for creates/updates
    for (const [variantId, qty] of requestedByVariant) {
      const variant = await prisma().productVariant.findUnique({ where: { id: variantId } });

      if (!variant) throw new Error(`Product variant with ID ${variantId} not found.`);

      // If creating a new order (no id) or increasing qty on update we ensure enough stock.
      if (!data.id) {
        if (qty > variant.stock) {
          throw new Error(`Quantity (${qty}) cannot exceed available stock (${variant.stock}) for product variant ${variant.name}.`);
        }
      } else {
        // On update, compare with existing order quantities
        const existingOrder = await prisma().order.findUnique({ where: { id: data.id }, include: { orderItems: true } });
        const existingQty = existingOrder?.orderItems?.filter(i => i.productId === variantId).reduce((s, i) => s + i.quantity, 0) ?? 0;
        const delta = qty - existingQty;
        if (delta > 0 && delta > variant.stock) {
          throw new Error(`Increasing quantity by ${delta} exceeds available stock (${variant.stock}) for product variant ${variant.name}.`);
        }
      }
    }

    // Compute adjustments map: variantId -> adjustment (negative = decrement stock, positive = increment)
    const adjustments = new Map<string, number>();

    if (!data.id) {
      // create path: decrement stock by requested qty
      for (const [variantId, qty] of requestedByVariant) adjustments.set(variantId, -qty);
    } else {
      // update: compute delta per variant
      const existingOrder = await prisma().order.findUnique({ where: { id: data.id }, include: { orderItems: true } });
      const existingByVariant = new Map<string, number>();
      for (const it of existingOrder?.orderItems ?? []) existingByVariant.set(it.productId, (existingByVariant.get(it.productId) ?? 0) + it.quantity);

      // For variants present in either existing or requested sets compute delta
      const variantIds = new Set<string>([...existingByVariant.keys(), ...requestedByVariant.keys()]);
      for (const variantId of variantIds) {
        const oldQty = existingByVariant.get(variantId) ?? 0;
        const newQty = requestedByVariant.get(variantId) ?? 0;
        const delta = newQty - oldQty;
        if (delta !== 0) adjustments.set(variantId, -delta); // negative delta means decrement stock, positive delta increase stock
      }
    }

    // Perform transactional upsert + stock updates
    const result = await prisma().$transaction(async tx => {
      const upserted = await tx.order.upsert({
        ...orderUpsert,
        include: {
          orderItems: { include: { productVariant: true } },
          shipment: true,
          payment: true,
        }
      });

      // Apply stock adjustments
      for (const [variantId, adj] of adjustments) {
        if (adj === 0) continue;
        if (adj < 0) {
          await tx.productVariant.update({ where: { id: variantId }, data: { stock: { decrement: Math.abs(adj) } } as any } as any);
        } else {
          await tx.productVariant.update({ where: { id: variantId }, data: { stock: { increment: Math.abs(adj) } } as any } as any);
        }
      }

      return upserted;
    });

    return result;
  }

  static async getOrderById(id: string) {
    return prisma().order.findUnique({ where: { id }, include: { orderItems: { include: { productVariant: true } }, shipment: true, payment: true } });
  }
}
