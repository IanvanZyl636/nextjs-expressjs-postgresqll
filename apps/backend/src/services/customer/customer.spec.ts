import { prisma } from '../../integrations/prisma';
import {CustomerService } from './customer.service';
import { CustomerUpsertSchema, CustomerViewModel } from '@nextjs-expressjs-postgresql/shared/zod/Customer.schema';

const customerData: CustomerViewModel = {
    id: '11111111-1111-1111-1111-111111111111',
    firstName: 'Test',
    surname: 'Customer',
    email: 'test-customer@example.com',
};

beforeAll(async () => {
    await prisma().$connect();
});

describe('Upsert Customer', () => {
    test('create and update customer', async () => {
        // validate input via zod
        CustomerUpsertSchema.parse(customerData);

        // create
        const created = await CustomerService.upsertCustomer(customerData);
        expect(created).toBeDefined();
        expect(created.id).toBe(customerData.id);
        expect(created.email).toBe('test-customer@example.com');

        // update
        const updatedData = { ...customerData, surname: 'Updated' };
        CustomerUpsertSchema.parse(updatedData);
        const updated = await CustomerService.upsertCustomer(updatedData);
        expect(updated).toBeDefined();
        expect(updated.surname).toBe('Updated');
        
        // verify helper
        const fetched = await CustomerService.getCustomerById(customerData?.id ?? '' );
        expect(fetched).toBeDefined();
        expect(fetched?.surname).toBe('Updated');
    }, 30000);
});

afterAll(async () => {
    await prisma().$disconnect();
});
