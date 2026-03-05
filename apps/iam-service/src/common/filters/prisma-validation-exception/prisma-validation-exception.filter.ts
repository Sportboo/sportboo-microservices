import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from 'apps/iam-service/generated/prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientValidationError)
export class PrismaClientValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(
    PrismaClientValidationExceptionFilter.name,
  );

  catch(exception: Prisma.PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(`Prisma Validation Error: ${exception.message}`);

    const status = HttpStatus.BAD_REQUEST;

    const errorResponse: any = {
      statusCode: status,
      message: 'Invalid request data',
      error: 'Bad Request',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Include full message in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = exception.message;
    }

    response.status(status).json(errorResponse);
  }
}