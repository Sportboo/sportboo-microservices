import { NestFactory } from '@nestjs/core';
import { ChatServiceModule } from './chat-service.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  
  (BigInt.prototype as any).toJSON = function () {
    return Number(this);
  };

  const app = await NestFactory.create<NestExpressApplication>(
    ChatServiceModule,
    {
      logger: ['error', 'debug', 'fatal', 'log', 'warn'],
    },
  );

  // Enable CORS (optional based on your frontend setup)
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unrecognized properties
      forbidNonWhitelisted: true, // throws error on extra props
      transform: true, // automatically transforms payloads to DTO instances
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Sportboo Chat API')
    .setDescription('API for Sportboo Chat Service')
    .setVersion('1.0')
    // .addTag('Patient Email Sign Up Endpoints')
    .addBearerAuth()
    .build();

  const documentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, documentOptions);

  const setupOptions: SwaggerCustomOptions = {};
  SwaggerModule.setup('api/docs', app, document, setupOptions);

    // Set up logger
  const logger = new Logger('Bootstrap');

  // App port
  const port = process.env.PORT ?? 3003;

  // Start microservice
  await app.startAllMicroservices();

  // Start the server
  await app.listen(port);

  const url = await app.getUrl();
  logger.log(`🚀 Sportboo Chat Service is running on: ${url}`);
  logger.log(`📚 Swagger docs available at: ${url}/api/docs`);
}

void bootstrap();
