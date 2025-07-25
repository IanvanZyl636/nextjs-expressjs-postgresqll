import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerOptions } from 'swagger-ui-express';

export let swaggerSpec: object | null = null;

export const initializeSwagger = () =>
  new Promise<void>((resolve) => {
    try {
      const swaggerOptions: SwaggerOptions = {
        definition: {
          openapi: '3.0.0',
          info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation',
          },
        },
        apis: ['./apps/backend/src/integrations/express/routers/**/*.ts'],
      };

      swaggerSpec = swaggerJSDoc(swaggerOptions);
      console.log('✅  Swagger initialized.');
      resolve();
    } catch (e) {
      console.error('❌  Swagger initialization failed.', e);
    }
  });
