import sharp from 'sharp';
import { uploadImageToMinio } from '../../integrations/s3-client';
import { randomUUID } from 'crypto';
import { ImageSize } from '@nextjs-expressjs-postgresql/shared';
import { prisma } from '../../integrations/prisma';


const sizes = [
  { key: ImageSize.THUMB, width: 150 },
  { key: ImageSize.MEDIUM, width: 500 },
  { key: ImageSize.LARGE, width: 1000 },
];

export async function processAndUploadImagesService(
  originalBuffer: Buffer  
): Promise<Record<string, string>> {
  const uploadedUrls: Record<string, string> = {};
  const generatedFileName = randomUUID();

  for (const size of sizes) {
    const resized = await sharp(originalBuffer).resize(size.width).toBuffer();
    const fileName = `${generatedFileName}-${size.key}.jpg`;
    const url = await uploadImageToMinio(resized, fileName);
    await prisma.image.create({
      data: {
        url,
        fileName,
        size: size.key,        
        isStale: true
      },
    });
    uploadedUrls[size.key] = url;
  }

  return uploadedUrls;
}