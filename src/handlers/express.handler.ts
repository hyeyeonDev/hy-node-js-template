import express, { json, urlencoded } from 'express';
import router from '@/src/routers/express.router';
import { enrichRequest, attachDbName, error404, error500 } from '@/src/middlewares/express.middleware';
// import swaggerUi from 'swagger-ui-express';
// import swaggerJsdoc from 'swagger-jsdoc';
// import { swaggerOptions } from '@/src/configs/swagger.config';

export async function express_init({ port, schema }: { port: number; schema: string }) {
  const app = express();
  // const specs = swaggerJsdoc(swaggerOptions);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.use(enrichRequest);
  app.use(attachDbName(schema));

  // app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
  app.post('/', router);

  app.use(error404);
  app.use(error500);

  app.listen(port, () => {
    console.log(`[HTTP] Server running on port ${port}`);
  });
}
