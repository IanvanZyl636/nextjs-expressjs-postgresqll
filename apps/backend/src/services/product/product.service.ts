import { prisma } from "../../integrations/prisma";

export async function getProduct(productId: string) {    

    const product = await prisma().product.findUnique({
        where: { id: productId },
        include: {
            variants:{
                include:{
                    mediaItems:true
                }
            }
        }
    });

    if(!product) {
        throw new Error("Product not found");
    }    

    return product;
}