/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { P2pBettingServiceModule } from './p2p-betting-service.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { INestApplication, Logger } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { CustomValidationPipe } from '@app/common/pipes';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
  PrismaClientExceptionFilter,
  PrismaClientValidationExceptionFilter,
} from '@app/common';
import { ConfigService } from '@nestjs/config';

function configureSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Sportboo P2P Betting API')
    .setDescription('API for Sportboo P2P Betting Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, documentOptions);

  const setupOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Sportboo API Documentation',
  };
  SwaggerModule.setup('api/docs', app, document, setupOptions);
}

async function bootstrap() {
  (BigInt.prototype as any).toJSON = function () {
    return Number(this);
  };

  const app = await NestFactory.create<NestExpressApplication>(
    P2pBettingServiceModule,
    {
      logger: ['error', 'debug', 'fatal', 'log', 'warn'],
    },
  );

  // Enable CORS
  app.enableCors();

  // Register global filters
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new HttpExceptionFilter(),
    new PrismaClientExceptionFilter(),
    new PrismaClientValidationExceptionFilter(),
  );

  // Register global pipes
  app.useGlobalPipes(new CustomValidationPipe());

  // Swagger setup
  configureSwagger(app);

  // Set up logger
  const logger = new Logger('Bootstrap');

  // App port
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') ?? 3004;

  // Start microservice
  await app.startAllMicroservices();

  // Start the server
  await app.listen(port);

  const url = await app.getUrl();
  logger.log(`🚀 Sportboo P2P Betting Service is running on: ${url}`);
  logger.log(`📚 Swagger docs available at: ${url}/api/docs`);
}

void bootstrap();
