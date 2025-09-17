import { prisma } from '../../integrations/prisma';
import { VendorUpsertSchema, VendorViewModel } from "@nextjs-expressjs-postgresql/shared/zod/Vendor.schema";
import { upsertVendor } from "./vendor.service";
import { VendorUserRole } from '@nextjs-expressjs-postgresql/shared/prisma/enhance/enums';

const vendorData: VendorViewModel = {
    id:'6ef5a6f0-24e3-46fb-a817-8dc169fcc496',
    name: 'Acme Suppliess',
    slug: 'acme-supplies',
    description: 'Wholesale supplier of office goods.',
    status: 'PENDING',
    users:[
        {
            id:'380651c1-9ca6-410f-ab4c-91bdcf38bd5f',
            userId:'f7ec2c1d-b432-4f90-b08d-664e00fbc6ed',
            role:VendorUserRole.OWNER
        }
    ]    
};

beforeAll(async () => {
    await prisma().$connect();
});

describe('Upsert Vendor', () => {
    test.only('create or update vendor', async () => {        
        const vendorModel = VendorUpsertSchema.parse(vendorData);
        await upsertVendor(vendorModel);
    }, 50000);
});

afterAll(async () => {
    await prisma().$disconnect();
});
