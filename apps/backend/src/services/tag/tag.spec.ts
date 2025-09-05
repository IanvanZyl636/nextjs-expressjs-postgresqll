import { prisma } from '../../integrations/prisma';
import { TagUpsertSchema, TagViewModel } from "@nextjs-expressjs-postgresql/shared";
import { upsertTag } from "./tag.service";

const tagData: TagViewModel = {
    id: '9aa51f79-8ceb-4c24-8da1-7fab508562f5',
    name: 'example-tag-1'
};

beforeAll(async () => {
    await prisma().$connect();
});

describe('Upsert Tag', () => {
    test.only('draft tag', async () => {
        const tag = TagUpsertSchema.parse(tagData);

        await upsertTag(tag);
    }, 50000);
});

afterAll(async () => {
    await prisma().$disconnect();
});
