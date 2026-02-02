import { CustomerUpsertSchema, CustomerViewModel } from '@nextjs-expressjs-postgresql/shared/zod/Customer.schema';
import { prisma } from '../../integrations/prisma';

export class CustomerService {

    static async upsertCustomer(data: CustomerViewModel) {
        const args = CustomerUpsertSchema.parse(data);

        return prisma().customer.upsert({
            ...args,
            include: { shippingAddresses: true, orders: true, cart: true, user: true },
        });
    }

    static async getCustomerById(id: string) {
        return prisma().customer.findUnique({ where: { id }, include: { shippingAddresses: true, orders: true, cart: true, user: true } });
    }
}