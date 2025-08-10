import { initializeDB } from './integrations/prisma';
import { initializeExpress } from './integrations/express';
import { initializeSwagger } from './integrations/swagger';

const initialzeEnvVariables = async () => { 
    if (!process.env.BACKEND_JWT_EXPIRATION) throw new Error('BACKEND_JWT_EXPIRATION is not defined in .env file');
    if (!process.env.BACKEND_JWT_REFRESH_EXPIRATION) throw new Error('BACKEND_JWT_REFRESH_EXPIRATION is not defined in .env file');
    if (!process.env.JWT_ACCESS_SECRET) throw new Error('JWT_ACCESS_SECRET is not defined in .env file');
    if (!process.env.JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not defined in .env file');
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not defined in .env file');
    if (!process.env.SMTP_HOST) throw new Error('SMTP_HOST is not defined in .env file');
    if (!process.env.SMTP_PORT) throw new Error('SMTP_PORT is not defined in .env file');
    if (!process.env.SMTP_USERNAME) throw new Error('SMTP_USERNAME is not defined in .env file');
    if (!process.env.SMTP_PASSWORD) throw new Error('SMTP_PASSWORD is not defined in .env file');
    if (!process.env.SMTP_EMAIL_FROM) throw new Error('SMTP_EMAIL_FROM is not defined in .env file');
    if (!process.env.SMTP_EMAIL_TO) throw new Error('SMTP_EMAIL_TO is not defined in .env file');
    if (!process.env.FRONTEND_URL) throw new Error('FRONTEND_URL is not defined in .env file');
    if (!process.env.MINIO_ENDPOINT) throw new Error('MINIO_ENDPOINT is not defined in .env file');
    if (!process.env.MINIO_ACCESS_KEY) throw new Error('MINIO_ACCESS_KEY is not defined in .env file');
    if (!process.env.MINIO_SECRET_KEY) throw new Error('MINIO_SECRET_KEY is not defined in .env file');
    if (!process.env.MINIO_BUCKET) throw new Error('MINIO_BUCKET is not defined in .env file');
    if (!process.env.MINIO_PUBLIC_URL) throw new Error('MINIO_PUBLIC_URL is not defined in .env file');

    console.log('✅  Environment variables initialized.');
}

(async () => {
  await initialzeEnvVariables();
  await initializeDB();
  await initializeSwagger();
  await initializeExpress();
})()

