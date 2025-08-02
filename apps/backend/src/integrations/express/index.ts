import express from 'express';
import authRouter from './routers/auth.router';
import userRouter from './routers/protected/user.router';
import swaggerUi from 'swagger-ui-express';
import errorLogger from './middleware/error-logger.middleware';
import { swaggerSpec } from '../swagger';
import { authenticateToken } from './middleware/authenticate-token.middleware';

export const initializeExpress = async () => new Promise<void>(resolve => {
  const app = express();

  app.use(express.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/swagger.json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.use('/api', authRouter);

  app.use('/api/protected', authenticateToken);
  app.use('/api/protected', userRouter);

  app.use(errorLogger);

  const port = process.env.PORT || 3333;
  const server = app.listen(port, async ()=> {
    console.log(`🚀 Server started!!! Check for api info on http://localhost:${port}/api-docs or ingest openapi spec on http://localhost:${port}/swagger.json`);
  });
  server.on('error', console.error);
  resolve();
});

