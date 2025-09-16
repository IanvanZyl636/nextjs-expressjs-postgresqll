import { Role } from '@nextjs-expressjs-postgresql/shared/prisma/generated/enums';
import { prisma } from '../../integrations/prisma';
import { registerService } from './auth.service';
import { CredentialInput, ProviderInput } from '@nextjs-expressjs-postgresql/shared/types/auth-provider.types';
import { AUTH_PROVIDER } from '@nextjs-expressjs-postgresql/shared/constants/auth-provider.constants';

beforeAll(async () => {
  await prisma().$connect();
});

describe('Auth', () => {
  test.only('registerUser and login user', async () => {
    try {
      registerService({
        provider: AUTH_PROVIDER.CREDENTIALS,
        data: {
          email: 'vanzyli101@gmail.com',
          password: '123456',
          ip: '127.0.0.1',
          userAgent: 'test'
        } as CredentialInput
      } as ProviderInput,
        Role.VENDOR
      );
    } catch (er) { 
      console.error(er) 
    }
  }, 5000);
});

afterAll(async () => {
  await prisma().$disconnect();
});
