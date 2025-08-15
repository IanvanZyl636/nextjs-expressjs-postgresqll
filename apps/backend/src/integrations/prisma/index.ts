import { GeneratedPrismaClient, PrismaClient, enhance } from '@nextjs-expressjs-postgresql/shared';

const prismaClient = new GeneratedPrismaClient();

export function prisma(userId?:string):PrismaClient{
  const user = userId ? { id:userId } : undefined;
  
  return enhance(prismaClient, { user }, { kinds: ['delegate', 'policy'] });  
}

export const initializeDB = async (): Promise<void> => {
  while (true) {
    try {
      await prisma().$connect();

      console.log('✅  Connected to the database.');
      break;
    } catch (e) {
      console.error(e);
      console.error('❌  DB connection failed. Retrying in 3 seconds...');
      await new Promise(res => setTimeout(res, 50000));
    }
  }
};
