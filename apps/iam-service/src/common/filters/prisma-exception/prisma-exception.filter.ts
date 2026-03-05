/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
 
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from 'apps/iam-service/generated/prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaClientExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { code, meta, message } = exception;

    // Log the error for debugging
    this.logger.error(
      `Prisma Error Code: ${code}, Meta: ${JSON.stringify(meta)}, Message: ${message}`,
    );

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';
    let errorDetails: any = undefined;

    switch (code) {
      case 'P2000':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'The provided value is too long for the column';
        errorDetails = meta;
        break;

      case 'P2001':
        status = HttpStatus.NOT_FOUND;
        errorMessage = 'Record not found';
        errorDetails = meta;
        break;

      case 'P2002':
        status = HttpStatus.CONFLICT;
        errorMessage = `Unique constraint violation on field: ${(meta?.target as string[])?.join(', ')}`;
        errorDetails = {
          field: meta?.target,
        };
        break;

      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Foreign key constraint failed';
        errorDetails = meta;
        break;

      case 'P2004':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'A constraint failed on the database';
        errorDetails = meta;
        break;

      case 'P2005':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Invalid value provided for field';
        errorDetails = meta;
        break;

      case 'P2006':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Invalid value provided';
        errorDetails = meta;
        break;

      case 'P2007':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Data validation error';
        errorDetails = meta;
        break;

      case 'P2008':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = 'Failed to parse the query';
        break;

      case 'P2009':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = 'Failed to validate the query';
        break;

      case 'P2010':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = 'Raw query failed';
        break;

      case 'P2011':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Null constraint violation';
        errorDetails = meta;
        break;

      case 'P2012':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Missing required value';
        errorDetails = meta;
        break;

      case 'P2013':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Missing required argument';
        errorDetails = meta;
        break;

      case 'P2014':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Relation violation';
        errorDetails = meta;
        break;

      case 'P2015':
        status = HttpStatus.NOT_FOUND;
        errorMessage = 'Related record not found';
        errorDetails = meta;
        break;

      case 'P2016':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Query interpretation error';
        errorDetails = meta;
        break;

      case 'P2017':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Records for relation are not connected';
        errorDetails = meta;
        break;

      case 'P2018':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Required connected records were not found';
        errorDetails = meta;
        break;

      case 'P2019':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Input error';
        errorDetails = meta;
        break;

      case 'P2020':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Value out of range';
        errorDetails = meta;
        break;

      case 'P2021':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = 'Table does not exist in the database';
        break;

      case 'P2022':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = 'Column does not exist in the database';
        break;

      case 'P2023':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Inconsistent column data';
        break;

      case 'P2024':
        status = HttpStatus.REQUEST_TIMEOUT;
        errorMessage = 'Connection pool timeout';
        break;

      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        errorMessage = 'Record to update/delete does not exist';
        errorDetails = meta;
        break;

      case 'P2026':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Unsupported database feature';
        break;

      case 'P2027':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = 'Multiple database errors occurred';
        break;

      case 'P2028':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = 'Transaction API error';
        break;

      case 'P2030':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = 'Fulltext index not found';
        break;

      case 'P2033':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = 'Number value out of range';
        errorDetails = meta;
        break;

      case 'P2034':
        status = HttpStatus.CONFLICT;
        errorMessage = 'Transaction conflict, please retry';
        break;

      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = 'Database error occurred';
        break;
    }

    // Build response object
    const errorResponse: any = {
      statusCode: status,
      message: errorMessage,
      error: this.getErrorName(status),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Only include details in development
    if (process.env.NODE_ENV === 'development' && errorDetails) {
      errorResponse.details = errorDetails;
      errorResponse.prismaCode = code;
    }

    response.status(status).json(errorResponse);
  }

  private getErrorName(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      case HttpStatus.REQUEST_TIMEOUT:
        return 'Request Timeout';
      default:
        return 'Internal Server Error';
    }
  }
}