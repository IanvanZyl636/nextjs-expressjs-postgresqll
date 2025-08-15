import sharp from 'sharp';
import { downloadMediaFromMinio, uploadMediaToMinio } from '../../integrations/s3-client';
import { randomUUID } from 'crypto';
import { ImageSize } from '@nextjs-expressjs-postgresql/shared';
import { prisma } from '../../integrations/prisma';
import sanitizeFilename from 'sanitize-filename';
import HttpError from '../../utils/error/http-error';
import { getImageExtension } from '../../helpers/sharp.helper';

export async function processAndUploadImagesService(
  file: Express.Multer.File
): Promise<string[]> {
  const sizes = [
    { enum: ImageSize.THUMB, width: 150 },
    { enum: ImageSize.MEDIUM, width: 500 },
    { enum: ImageSize.LARGE, width: 1000 },
  ];
  const uploadedFileIds: string[] = [];
  const generatedFileLocation = randomUUID();
  const cleanBuffer = await sharp(file.buffer)
    .withMetadata({ exif: undefined })
    .toBuffer();
  const sanitizedFileName = sanitizeFilename(file.originalname);
  const originalMedia = await processImage(cleanBuffer, sanitizedFileName, generatedFileLocation, ImageSize.ORIGINAL);

  uploadedFileIds.push(originalMedia.id);

  for (const size of sizes) {
    const resizedImage = await sharp(file.buffer).resize(size.width).webp();
    const buffer = await resizedImage.toBuffer();
    const resizedMedia = await processImage(buffer, sanitizedFileName, generatedFileLocation, size.enum);

    uploadedFileIds.push(resizedMedia.id);
  }

  return uploadedFileIds;
}

export async function downloadMediaService(fileId: string) {
  const media = await prisma().media.findUnique({
    where: { id: fileId }
  });

  if (!media) throw new HttpError(400, 'Media not found');

  return await downloadMediaFromMinio(media.bucketKey);
}

async function processImage(buffer: Buffer<ArrayBufferLike>, sanitizedFileName: string, generatedFileLocation: string, imageSize: ImageSize) {
  const metadata = await sharp(buffer).metadata();
  const extension = await getImageExtension(metadata);
  const fileName = `images/${generatedFileLocation}/${imageSize}.${extension}`;

  const mimeType = `image/${extension}`;

  const bucketKey = await uploadMediaToMinio(buffer, fileName, mimeType);

  return await prisma().image.create({
    data: {      
      bucketKey,
      fileName: sanitizedFileName,
      mimeType,      
      fileSize: buffer.length,
      width: metadata.width,
      height: metadata.height,
      imageSize,
      isStale: true
    }
  });
}