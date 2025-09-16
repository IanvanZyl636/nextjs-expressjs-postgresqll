import { prisma } from '../../integrations/prisma';
import { VendorUpsertSchema, VendorViewModel } from "@nextjs-expressjs-postgresql/shared/zod/Vendor.schema";
import { upsertVendor } from "./vendor.service";

const vendorData: VendorViewModel = {
    name: 'Acme Supplies',
    slug: 'acme-supplies',
    description: 'Wholesale supplier of office goods.',
    status: 'PENDING',
    ownerId: 'b3d5f0e2-7c4a-4f1a-9f2b-9a4e6d1c2e3f',
};

beforeAll(async () => {
    await prisma().$connect();
});

describe('Upsert Vendor', () => {
    test.only('create or update vendor', async () => {
        const vendor = VendorUpsertSchema.parse(vendorData);
        await upsertVendor(vendor);
    }, 50000);
});

afterAll(async () => {
    await prisma().$disconnect();
});
