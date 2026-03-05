import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { PrismaClientExceptionFilter } from './prisma-exception.filter';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

describe('PrismaClientExceptionFilter', () => {
  let filter: PrismaClientExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaClientExceptionFilter],
    }).compile();

    filter = module.get<PrismaClientExceptionFilter>(PrismaClientExceptionFilter);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRequest = {
      url: '/test-url',
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
        getNext: jest.fn(),
      }),
      getType: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    } as ArgumentsHost;
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should catch P2002 (Unique constraint violation) and return CONFLICT', () => {
    const exception = new PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: '2.x',
      meta: { target: ['email_address'] },
    });
    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: 'Unique constraint violation: email_address',
      error: 'PrismaClientKnownRequestError',
      timestamp: expect.any(String),
      path: mockRequest.url,
    });
  });

  it('should catch P2003 (Foreign key constraint failed) and return BAD_REQUEST', () => {
    const exception = new PrismaClientKnownRequestError('Foreign key constraint failed', {
      code: 'P2003',
      clientVersion: '2.x',
      meta: { field_name: 'userId' },
    });
    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Foreign key constraint failed',
      error: 'PrismaClientKnownRequestError',
      timestamp: expect.any(String),
      path: mockRequest.url,
    });
  });

  it('should catch P2025 (Record not found) and return NOT_FOUND', () => {
    const exception = new PrismaClientKnownRequestError('Record not found', {
      code: 'P2025',
      clientVersion: '2.x',
      meta: { cause: 'Record to update not found' },
    });
    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Record not found',
      error: 'PrismaClientKnownRequestError',
      timestamp: expect.any(String),
      path: mockRequest.url,
    });
  });

  it('should catch other PrismaClientKnownRequestError codes and return INTERNAL_SERVER_ERROR', () => {
    const exception = new PrismaClientKnownRequestError('Some other Prisma error', {
      code: 'P9999', // Unknown code
      clientVersion: '2.x',
    });
    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message,
      error: 'PrismaClientKnownRequestError',
      timestamp: expect.any(String),
      path: mockRequest.url,
    });
  });

  // it('should catch HttpException and return its status and response', () => {
  //   const httpException = new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
  //   filter.catch(httpException, mockArgumentsHost);

  //   expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
  //   expect(mockResponse.json).toHaveBeenCalledWith({
  //     statusCode: HttpStatus.FORBIDDEN,
  //     message: 'Forbidden resource',
  //     error: 'HttpException',
  //     timestamp: expect.any(String),
  //     path: mockRequest.url,
  //   });
  // });

  // it('should catch unknown errors and return INTERNAL_SERVER_ERROR', () => {
  //   const unknownError = new Error('Something unexpected happened');
  //   filter.catch(unknownError, mockArgumentsHost);

  //   expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  //   expect(mockResponse.json).toHaveBeenCalledWith({
  //     statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //     message: 'Internal server error',
  //     error: 'UnknownError',
  //     timestamp: expect.any(String),
  //     path: mockRequest.url,
  //   });
  // });
});
