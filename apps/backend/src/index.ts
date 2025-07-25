import { initializeDB } from './integrations/prisma';
import { initializeExpress } from './integrations/express';
import { initializeSwagger } from './integrations/swagger';

(async () => {
  await initializeDB();
  await initializeSwagger();
  await initializeExpress();
})()

