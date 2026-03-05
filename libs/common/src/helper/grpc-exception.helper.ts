import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  GoneException,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

export class GrpcExceptionHelper {
  // --- 🔹 THROWERS (for microservices) ---
  static Error = class {
    static cancelled(message = 'Request cancelled') {
      return new RpcException({ code: status.CANCELLED, message });
    }

    static unknown(message = 'Unknown error occurred') {
      return new RpcException({ code: status.UNKNOWN, message });
    }

    static invalidArgument(message = 'Invalid argument') {
      return new RpcException({ code: status.INVALID_ARGUMENT, message });
    }

    static deadlineExceeded(message = 'Deadline exceeded') {
      return new RpcException({ code: status.DEADLINE_EXCEEDED, message });
    }

    static notFound(message = 'Resource not found') {
      return new RpcException({ code: status.NOT_FOUND, message });
    }

    static alreadyExists(message = 'Resource already exists') {
      return new RpcException({ code: status.ALREADY_EXISTS, message });
    }

    static permissionDenied(message = 'Permission denied') {
      return new RpcException({ code: status.PERMISSION_DENIED, message });
    }

    static unauthenticated(message = 'Unauthenticated') {
      return new RpcException({ code: status.UNAUTHENTICATED, message });
    }

    static resourceExhausted(message = 'Resource exhausted') {
      return new RpcException({ code: status.RESOURCE_EXHAUSTED, message });
    }

    static failedPrecondition(message = 'Failed precondition') {
      return new RpcException({ code: status.FAILED_PRECONDITION, message });
    }

    static aborted(message = 'Operation aborted') {
      return new RpcException({ code: status, message });
    }

    static outOfRange(message = 'Out of range') {
      return new RpcException({ code: status.OUT_OF_RANGE, message });
    }

    static unimplemented(message = 'Not implemented') {
      return new RpcException({ code: status.UNIMPLEMENTED, message });
    }

    static internal(message = 'Internal error') {
      return new RpcException({ code: status.INTERNAL, message });
    }

    static unavailable(message = 'Service unavailable') {
      return new RpcException({ code: status.UNAVAILABLE, message });
    }

    static dataLoss(message = 'Data loss') {
      return new RpcException({ code: status.DATA_LOSS, message });
    }
  };

  // --- 🔹 MAPPER (for gateway / client services) ---
  static mapToHttp(error: any): never {
    const details = error.details || error.message || 'Unknown error';

    switch (error.code) {
      case status.CANCELLED:
        throw new GoneException(details);

      case status.UNKNOWN:
        throw new InternalServerErrorException(details);

      case status.INVALID_ARGUMENT:
        throw new BadRequestException(details);

      case status.DEADLINE_EXCEEDED:
        throw new RequestTimeoutException(details);

      case status.NOT_FOUND:
        throw new NotFoundException(details);

      case status.ALREADY_EXISTS:
        throw new ConflictException(details);

      case status.PERMISSION_DENIED:
        throw new ForbiddenException(details);

      case status.UNAUTHENTICATED:
        throw new UnauthorizedException(details);

      case status.RESOURCE_EXHAUSTED:
        throw new GatewayTimeoutException(details);

      case status.FAILED_PRECONDITION:
        throw new BadRequestException(details);

      case status.ABORTED:
        throw new ConflictException(details);

      case status.OUT_OF_RANGE:
        throw new BadRequestException(details);

      case status.UNIMPLEMENTED:
        throw new InternalServerErrorException('Not implemented');

      case status.INTERNAL:
        throw new InternalServerErrorException(details);

      case status.UNAVAILABLE:
        throw new ServiceUnavailableException(details);

      case status.DATA_LOSS:
        throw new InternalServerErrorException(details);

      default:
        throw new InternalServerErrorException(details);
    }
  }
}
