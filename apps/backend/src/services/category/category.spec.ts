import { prisma } from '../../integrations/prisma';
import { CategoryViewModel, CategoryUpsertSchema } from "@nextjs-expressjs-postgresql/shared/zod/Category.schema";
import { upsertCategory } from "./category.service";

const categoryData: CategoryViewModel = {    
    name: 'Rebel Boot4',
    slug: 'rebel-boot4',    
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
