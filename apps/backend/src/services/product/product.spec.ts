import { prisma } from '../../integrations/prisma';
import { ProductUpsertWithRulesSchema, ProductViewModel } from "@nextjs-expressjs-postgresql/shared";
import {upsertProduct} from './product.service'

const draftProduct:ProductViewModel = {
  slug: "rebel-shoe",
  name: "Rebel Shoe",
  status: "DRAFT" 
};

const activeProduct:ProductViewModel = {
  slug: "rebel-boot",
  name: "Rebel Boot",
  description:'Boot',
  status: "ACTIVE",
  productVariants:[
    {
        slug:'asds',
        name:'asd',
        price:12,
        stock:2,
       mediaItems:[
        {
            id:'1d28975a-5e7e-46e1-87c6-ddaab4e0322a',
            mediaType: 'Image'
        }
       ]
    }
  ]
};


beforeAll(async () => {
  await prisma().$connect();
});

describe('Upsert Product', () => {
  test('draft product', async () => {   
    const product = ProductUpsertWithRulesSchema.parse(draftProduct);

    await upsertProduct(product);
  },50000); 

  test.only('draft product', async () => {  
    await prisma().productVariantMedia.deleteMany();
    await prisma().productVariant.deleteMany();
    await prisma().product.deleteMany();

    const product = ProductUpsertWithRulesSchema.parse(activeProduct);

    await upsertProduct(product);
  },50000); 
});

afterAll(async () => {
  await prisma().$disconnect();
});
