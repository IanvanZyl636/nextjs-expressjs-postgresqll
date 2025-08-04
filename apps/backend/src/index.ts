import { initializeDB } from './integrations/prisma';
import { initializeExpress } from './integrations/express';
import { initializeSwagger } from './integrations/swagger';

const initialzeEnvVariables = async () => { 
    if (!process.env.BACKEND_JWT_EXPIRATION) throw new Error('BACKEND_JWT_EXPIRATION is not defined in .env file');
    if (!process.env.BACKEND_JWT_REFRESH_EXPIRATION) throw new Error('BACKEND_JWT_REFRESH_EXPIRATION is not defined in .env file');
    if (!process.env.JWT_ACCESS_SECRET) throw new Error('JWT_ACCESS_SECRET is not defined in .env file');
    if (!process.env.JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not defined in .env file');
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not defined in .env file');

    console.log('✅  Environment variables initialized.');
}

(async () => {
  await initialzeEnvVariables();
  await initializeDB();
  await initializeSwagger();
  await initializeExpress();
})()

