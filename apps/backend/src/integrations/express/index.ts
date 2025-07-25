import express from 'express';
import f1Router from './routers/f1.router';
import swaggerUi from 'swagger-ui-express';
import errorLogger from './middleware/error-logger.middleware';
import { swaggerSpec } from '../swagger';

export const initializeExpress = async () => new Promise<void>(resolve => {
  const app = express();

  app.use(express.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/swagger.json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.use('/api', f1Router);
  app.use(errorLogger);

  const port = process.env.PORT || 3333;
  const server = app.listen(port, async ()=> {
    console.log(`🚀 Server started!!! Check for api info on http://localhost:${port}/api-docs or ingest openapi spec on http://localhost:${port}/swagger.json`);
  });
  server.on('error', console.error);
  resolve();
});

