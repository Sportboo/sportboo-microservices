/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExceptionResponse } from '@app/common';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    // Extract validation messages
    const messages = Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message
      : [exceptionResponse.message];

    const errorResponse: ExceptionResponse = {
      message: Array.isArray(exceptionResponse.message)
        ? 'Validation failed'
        : exceptionResponse.message,
      statusCode: status,
      error: 'Bad Request',
      messages: messages,
    };

    response.status(status).json(errorResponse);
  }
}
