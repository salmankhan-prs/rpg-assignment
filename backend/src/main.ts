import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - use env variable for production
  const corsOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',') 
    : ['http://localhost:5173'];
  
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'OPTIONS'],
  });
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Listen on 0.0.0.0 for external access
  const port = process.env.PORT ?? 3200;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 GraphQL Playground: http://localhost:${port}/graphql`);
}
bootstrap();
