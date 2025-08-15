import { MediaType } from "@nextjs-expressjs-postgresql/shared";
import { prisma } from "../../integrations/prisma";

export async function getProduct(productId: string) {    

    const product = await prisma().product.findUnique({
        where: { id: productId },
        include: {
            mediaItems: {
                include:{
                    media:true
                }
            }
        }
    });

    if(!product) {
        throw new Error("Product not found");
    }

    for (const item of product.mediaItems) {
        if(item.media.mediaType === MediaType.Image) {
            item.media.width = 800;
            item.media.height = 600;
        }
    }

    return product;
}