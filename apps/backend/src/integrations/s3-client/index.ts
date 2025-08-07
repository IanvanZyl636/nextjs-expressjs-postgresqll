import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export async function uploadImageToMinio(
  buffer: Buffer,
  key: string,
  contentType = 'image/jpeg' 
): Promise<string> {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.MINIO_BUCKET!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));

  return `${process.env.MINIO_PUBLIC_URL}/${key}`;
}