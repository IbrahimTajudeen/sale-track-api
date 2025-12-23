/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.fitler';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();
const logger = new Logger('Bootstrap Entry Point');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalFilters(new AllExceptionsFilter());

  // app.useGlobalGuards(new JwtAuthGuard());
  
  // Enable CORS for a specific origin (e.g., your frontend application)
  // Uncomment and adjust the origin as needed
  //   app.enableCors({
  //   origin: 'http://localhost:3200', // allowing front end
  //   credentials: true,
  // });
  
  app.setGlobalPrefix('api/v1');
  
  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Sale Track API')
    .setDescription('API documentation for the Sale Track app, built with NestJS and Supabase, enabling users to track and manage sales records efficiently.')
    .setVersion('1.0.0')
    .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',) // if using JWT auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  console.log(`API is running on port ${process.env.PORT ?? 3100}`);
  console.log(`Swagger docs available at http://localhost:${process.env.PORT ?? 3100}/api/docs`);
  logger.log(`Swagger docs available at http://localhost:${process.env.PORT ?? 3100}/api/docs`);
  
  
  
  await app.listen(process.env.PORT ?? 3100);
}
bootstrap();
