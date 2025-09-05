import { prisma } from '../../integrations/prisma';
import { CategoryUpsertSchema, CategoryViewModel } from "@nextjs-expressjs-postgresql/shared";
import { upsertCategory } from "./category.service";

const categoryData: CategoryViewModel = {
    id: '9aa51f79-8ceb-4c24-8da1-7fab508562f4',
    name: 'Rebel Boot3',
    slug: 'rebel-boot3',
    parentId: '89f834bc-8dd6-47fa-b989-f0c5edc0e922'
};

beforeAll(async () => {
    await prisma().$connect();
});

describe('Upsert Category', () => {
    test.only('draft category', async () => {
        const category = CategoryUpsertSchema.parse(categoryData);

        await upsertCategory(category);
    }, 50000);
});

afterAll(async () => {
    await prisma().$disconnect();
});
