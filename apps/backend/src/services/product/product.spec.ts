import { prisma } from '../../integrations/prisma';
import { ProductModel, ProductUpsertWithRulesSchema } from "@nextjs-expressjs-postgresql/shared";
import {upsertProduct} from './product.service'

const sampleProduct:ProductModel = {
  slug: "rebel-shoe",
  name: "Rebel Shoe",
  status: "DRAFT",
  productVariants: [
    {
      slug: "rebel-shoe-size-9",
      name: "Rebel Shoe Size 9",
      price: 1200,
      stock: 50,     
      featured: true,
      sku: "RBL-SHOE-9",
      description: "Comfortable running shoe, size 9",
      color: "Black",
      weight: 1.2,
      dimensions: {
        length: 30,
        width: 12,
        height: 10,
        unit: "cm",
      }          
    },
    {
      slug: "rebel-shoe-size-10",
      name: "Rebel Shoe Size 10",
      price: 1200,
      stock: 30,  
      sku: "RBL-SHOE-10",
      description: "Comfortable running shoe, size 10",
      color: "Blue",
      weight: 1.3,
      dimensions: {
        length: 31,
        width: 13,
        height: 11,
        unit: "cm",
      }
    },
  ],
};


beforeAll(async () => {
  await prisma().$connect();
});

describe('Upsert Product', () => {
  test('upsert product', async () => {   
    const product = ProductUpsertWithRulesSchema.parse(sampleProduct);

    await upsertProduct(product);
  },50000); 
});

afterAll(async () => {
  await prisma().$disconnect();
});
