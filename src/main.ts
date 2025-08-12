import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure raw body parsing for Stripe webhooks
  app.use('/payments/webhook', express.raw({ type: 'application/json' }));

  // Regular JSON parsing for other routes
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('COSMIC STORE API')
    .setDescription('COSMIC STORE: API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Products', 'Product management and operations')
    .addTag('Cart', 'Shopping cart operations')
    .addTag('Orders', 'Order management and processing')
    .addTag('Users', 'User profile and management')
    .addTag('Reviews', 'Product reviews and ratings')
    .addTag('Wishlist', 'User wishlist management')
    .addTag('Admin', 'Administrative operations')
    .addTag('Payments', 'Stripe payment processing')
    .addTag('Payment Methods', 'Payment method management')
    .addTag('Upload', 'File upload operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
