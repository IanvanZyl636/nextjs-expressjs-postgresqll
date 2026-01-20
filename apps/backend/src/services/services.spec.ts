import { Role } from '@nextjs-expressjs-postgresql/shared/prisma/generated/enums';
import { Readable } from 'stream';
import { CredentialInput, ProviderInput } from '@nextjs-expressjs-postgresql/shared/types/auth-provider.types';
import { AUTH_PROVIDER } from '@nextjs-expressjs-postgresql/shared/constants/auth-provider.constants';
import { prisma } from '../integrations/prisma';
import { registerService } from './auth/auth.service';
import { VendorUpsertSchema, VendorViewModel } from '@nextjs-expressjs-postgresql/shared/zod/Vendor.schema';
import { VendorUserRole } from '@nextjs-expressjs-postgresql/shared/prisma/enhance/enums';
import { upsertVendor } from './vendor/vendor.service';
import { readFileSync } from 'fs';
import { processAndUploadImagesService } from './media/media.service';
import { ProductUpsertWithRulesSchema, ProductViewModel } from '@nextjs-expressjs-postgresql/shared/zod/Product.schema';
import { upsertProduct } from './product/product.service';
import { CategoryUpsertSchema, CategoryViewModel } from '@nextjs-expressjs-postgresql/shared/zod/Category.schema';
import { upsertCategory } from './category/category.service';
import { TagUpsertSchema, TagViewModel } from '@nextjs-expressjs-postgresql/shared/zod/Tag.schema';
import { upsertTag } from './tag/tag.service';
import { CartUpsertSchema, CartViewModel } from '@nextjs-expressjs-postgresql/shared/zod/Cart.schema';
import { CartService } from './cart/cart.service';

beforeAll(async () => {
    await prisma().$connect();
});

describe('Full service flow', () => {
    test.only('Full service flow', async () => {
        const user = await createUser();
        const vendor = await createVender(user.id);
        const image = await createImage();
        const category = await createCategory();
        const tag =  await createTag();
        const product = await createActiveProduct(vendor.id, category.id, tag.id, image.id);
        await createCart(product.productVariants[0].id);

    }, 500000);
});

afterAll(async () => {
    await prisma().$disconnect();
});

async function createUser() {
    try {
        await registerService({
            provider: AUTH_PROVIDER.CREDENTIALS,
            data: {
                email: 'vanzyli101@gmail.com',
                password: 'P@ssw0rd123',
                ip: '127.0.0.1',
                userAgent: 'test'
            } as CredentialInput
        } as ProviderInput,
            Role.VENDOR
        );

        const user = await prisma().user.findFirst();

        if (!user) throw new Error('User not created');

        return user;
    } catch (er) {
        console.error(er);
        throw er;
    }
}

async function createVender(userId: string) {
    const vendorData: VendorViewModel = {
        name: 'Acme Suppliess',
        slug: 'acme-supplies',
        description: 'Wholesale supplier of office goods.',
        status: 'PENDING',
        users: [
            {
                userId,
                role: VendorUserRole.OWNER
            }
        ]
    };

    const vendorModel = VendorUpsertSchema.parse(vendorData);
    return await upsertVendor(vendorModel);
}

async function createImage() {
    function createImageFile(buffer: Buffer, name = 'small.png'): Express.Multer.File {
        return {
            fieldname: 'file',
            originalname: name,
            encoding: '7bit',
            mimetype: 'image/png',
            size: buffer.length,
            buffer,
            destination: '',
            filename: '',
            path: '',
            stream: (() => {
                const s = new Readable();
                s.push(buffer);
                s.push(null);
                return s;
            })(),
        };
    }

    const fixture = readFileSync(__dirname + '/media/__fixtures__/small.png');

    const file = createImageFile(fixture, 'small.png');

    return await processAndUploadImagesService(file);
}

async function createCategory() {
    const categoryData: CategoryViewModel = {
        name: 'Rebel Boot4',
        slug: 'rebel-boot4',
    };

    const category = CategoryUpsertSchema.parse(categoryData);

    return await upsertCategory(category);
}

async function createTag() {
    const tagData: TagViewModel = {
        name: 'example-tag-1'
    };

    const tag = TagUpsertSchema.parse(tagData);

    return await upsertTag(tag);
}

async function createActiveProduct(vendorId: string, categoryId: string, tagId: string, productImageId: string) {
    const activeProduct: ProductViewModel = {
        slug: "rebel-boot",
        name: "Rebel Boot",
        vendorId,
        description: 'Boot',
        status: "ACTIVE",
        categories: [
            {
                id: categoryId
            }
        ],
        tags: [
            {
                id: tagId
            }
        ],
        productVariants: [
            {
                slug: 'asds',
                name: 'asd',
                price: 12,
                stock: 2,
                galleryMedia: [
                    {
                        id: productImageId,
                        mediaType: 'Image'
                    }
                ]
            }
        ]
    };

    const product = ProductUpsertWithRulesSchema.parse(activeProduct);

    return await upsertProduct(product);
}

async function createCart(productVariantId:string){
    const cartData: CartViewModel = {      
      cartItems: [
        { productVariantId, quantity: 1 },    
      ]
    };

    CartUpsertSchema.parse(cartData);
          
    return await CartService.upsertCart(cartData);
}