import express from 'express';
import { authRouter } from './routers/auth.router';
import { protectedUserRouter } from './routers/protected/user.router';
import { protectedMediaRouter } from './routers/protected/media.router';
import { mediaRouter } from './routers/media.router';
import swaggerUi from 'swagger-ui-express';
import errorLoggerMiddleware from './middleware/error-logger.middleware';
import { swaggerSpec } from '../swagger';
import { authenticateTokenMiddleware } from './middleware/authenticate-token.middleware';
import { protectedCategoryRouter } from './routers/protected/category.router';

export const initializeExpress = async () => new Promise<void>(resolve => {
  const app = express();

  app.use(express.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/swagger.json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.use('/api', authRouter);
  app.use('/api', mediaRouter);

  app.use('/api/protected', authenticateTokenMiddleware);
  app.use('/api/protected', protectedUserRouter);
  app.use('/api/protected', protectedMediaRouter);
  app.use('/api/protected', protectedCategoryRouter);

  app.use(errorLoggerMiddleware);

  const port = process.env.PORT || 3333;
  const server = app.listen(port, async ()=> {
    console.log(`🚀 Server started!!! Check for api info on http://localhost:${port}/api-docs or ingest openapi spec on http://localhost:${port}/swagger.json`);
  });
  server.on('error', console.error);
  resolve();
});

