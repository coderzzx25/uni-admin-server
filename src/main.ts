import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    session({
      secret: 'coderzzx',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
