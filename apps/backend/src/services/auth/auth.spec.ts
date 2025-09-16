import { prisma } from '../../integrations/prisma';
// import { registerService } from './auth.service';


beforeAll(async () => {
  await prisma().$disconnect();
});

describe('Auth', () => {
  test('registerUser and login user', async () => {   
    // registerService(ProviderInput)
    // loginUser('root@email.com','password');
  }); 
});

afterAll(async () => {
  await prisma().$disconnect();
});
