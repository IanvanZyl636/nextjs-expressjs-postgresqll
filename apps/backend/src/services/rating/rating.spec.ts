import { prisma } from '../../integrations/prisma';
import { RatingViewModel, RatingUpsertSchema } from "@nextjs-expressjs-postgresql/shared/zod/Rating.schema";
import { upsertRating } from "./rating.service";

const ratingData: RatingViewModel = {
    id: '11111111-1111-1111-1111-111111111111',
    productId: '22222222-2222-2222-2222-222222222222',
    userId: '33333333-3333-3333-3333-333333333333',
    rating: 4,
    review: 'Nice product',
};

beforeAll(async () => {
    await prisma().$connect();
});

describe('Upsert Rating', () => {
    test.only('draft rating', async () => {
        const rating = RatingUpsertSchema.parse(ratingData);

        await upsertRating(rating);
    }, 50000);
});

afterAll(async () => {
    await prisma().$disconnect();
});
