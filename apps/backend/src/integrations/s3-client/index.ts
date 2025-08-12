import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  region: process.env.MINIO_REGION,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export async function uploadMediaToMinio(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.MINIO_BUCKET!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));

  return key;
}

export async function downloadMediaFromMinio(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.MINIO_BUCKET!,
    Key: key,
  });  

  return await s3.send(command);
}