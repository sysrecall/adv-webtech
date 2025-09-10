import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
 app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8000', 
    credentials: true, // ✅ Allow cookies
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization', 
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
