import { prisma } from '../../integrations/prisma';
import { ProductViewModel, ProductUpsertWithRulesSchema } from "@nextjs-expressjs-postgresql/shared/zod/Product.schema";
import {upsertProduct} from './product.service'

const draftProduct:ProductViewModel = {
  slug: "rebel-shoe",
  name: "Rebel Shoe",
  vendorId:'b81e990d-c9f1-4ed5-9f05-94ef2984fda6',
  status: "DRAFT" 
};

const activeProduct:ProductViewModel = {
  slug: "rebel-boot",
  name: "Rebel Boot",
  vendorId:'b81e990d-c9f1-4ed5-9f05-94ef2984fda6',
  description:'Boot',
  status: "ACTIVE",
  categories:[
    {
        id:'b81e990d-c9f1-4ed5-9f05-94ef2984fda6'
    }
  ],
  tags:[
    {
        id:'b81e990d-c9f1-4ed5-9f05-94ef2984fda6'
    }
  ],
  productVariants:[
    {
        slug:'asds',
        name:'asd',
        price:12,
        stock:2,
        galleryMedia:[
          {
            id:'b81e990d-c9f1-4ed5-9f05-94ef2984fda6',
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
    await prisma().productVariantGalleryMedia.deleteMany();
    await prisma().productVariantAttachment.deleteMany();
    await prisma().productVariant.deleteMany();
    await prisma().product.deleteMany();

    const product = ProductUpsertWithRulesSchema.parse(activeProduct);

    await upsertProduct(product);
  },50000); 
});

afterAll(async () => {
  await prisma().$disconnect();
});
