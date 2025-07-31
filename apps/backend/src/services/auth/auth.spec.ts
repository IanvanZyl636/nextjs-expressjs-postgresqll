import { prisma } from '../../integrations/prisma';

beforeAll(async () => {
  await prisma.$disconnect();
});

describe('Auth', () => {
  test('registerUser and login user', async () => {   
    // registerUser('root@email.com', 'password');
    // loginUser('root@email.com','password');
  }); 
});

afterAll(async () => {
  await prisma.$disconnect();
});
