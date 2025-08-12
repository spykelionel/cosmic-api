import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { AppModule } from './app.module';
import { ResponseTemplateInterceptor } from './core/interceptors/response-template/response-template.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure raw body parsing for Stripe webhooks
  app.use('/payments/webhook', express.raw({ type: 'application/json' }));

  // Regular JSON parsing for other routes
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.enableCors({
    origin: ['*'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(app.get(ResponseTemplateInterceptor));

  const config = new DocumentBuilder()
    .setTitle('COSMIC STORE API')
    .setDescription('COSMIC STORE: API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/swagger`);
}
bootstrap();
