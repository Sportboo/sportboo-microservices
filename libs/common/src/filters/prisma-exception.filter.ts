import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
  
  @Catch()
  export class PrismaClientExceptionFilter implements ExceptionFilter {

    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
  
      if (exception instanceof PrismaClientKnownRequestError) {
        // Handle Prisma Client Known Request Errors
        const prismaError = exception as PrismaClientKnownRequestError;
  
        let statusCode = HttpStatus.BAD_REQUEST;
        let message = 'An error occurred';
  
        switch (prismaError.code) {
          case 'P2002': // Unique constraint violation
            statusCode = HttpStatus.CONFLICT;
            message = `Unique constraint violation: ${prismaError.meta?.target}`;
            break;
  
          case 'P2003': // Foreign key constraint failed
            statusCode = HttpStatus.BAD_REQUEST;
            message = 'Foreign key constraint failed';
            break;
  
          case 'P2025': // Record not found
            statusCode = HttpStatus.NOT_FOUND;
            message = 'Record not found';
            break;
  
          // Add more cases for other Prisma error codes if needed
  
          default:
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            message = prismaError.message;
            break;
        }
  
        response.status(statusCode).json({
          statusCode,
          message,
          error: 'PrismaClientKnownRequestError',
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      } else if (exception instanceof HttpException) {
        // Handle NestJS HttpExceptions
        const statusCode = exception.getStatus();
        const message = exception.getResponse();
  
        response.status(statusCode).json({
          statusCode,
          message,
          error: exception.name,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      } else {
        // Handle Unknown Errors
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          error: 'UnknownError',
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      }
    }
  }
  