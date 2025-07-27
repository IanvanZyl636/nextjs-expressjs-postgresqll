import { prisma } from '../../integrations/prisma';
import {registerUser} from './auth.service';

beforeAll(async () => {
  await prisma.$disconnect();
});

describe('Other block', () => {
  test('three', () => {   
    registerUser();
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
