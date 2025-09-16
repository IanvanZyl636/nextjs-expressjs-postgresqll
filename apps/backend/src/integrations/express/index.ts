import express from 'express';
import { publicAuthRouter } from './routers/auth.router';
import { protectedUserRouter } from './routers/user.router';
import { protectedMediaRouter, publicMediaRouter } from './routers/media.router';
import swaggerUi from 'swagger-ui-express';
import errorLoggerMiddleware from './middleware/error-logger.middleware';
import { swaggerSpec } from '../swagger';
import { authenticateTokenMiddleware } from './middleware/authenticate-token.middleware';
import { protectedCategoryRouter } from './routers/category.router';
import { protectedVendorRouter, publicVendorRouter } from './routers/vendor.router';
import { protectedProductRouter } from './routers/product.router';

export const initializeExpress = async () => new Promise<void>(resolve => {
  const app = express();

  app.use(express.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/swagger.json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.get('/api/ping', (_, res) => res.json({'message': 'pong'}));

  app.use('/api', publicAuthRouter);
  app.use('/api', publicMediaRouter);
  app.use('/api', publicVendorRouter);

  app.use('/api/protected', authenticateTokenMiddleware);
  app.use('/api/protected', protectedUserRouter);
  app.use('/api/protected', protectedMediaRouter);
  app.use('/api/protected', protectedCategoryRouter);
  app.use('/api/protected', protectedVendorRouter);
  app.use('/api/protected', protectedProductRouter);

  app.use(errorLoggerMiddleware);

  const port = process.env.PORT || 3333;
  const server = app.listen(port, async ()=> {
    console.log(`🚀 Server started!!! Check for api info on http://localhost:${port}/api-docs or ingest openapi spec on http://localhost:${port}/swagger.json`);
  });
  server.on('error', console.error);
  resolve();
});

