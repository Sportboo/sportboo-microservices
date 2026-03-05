import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '@app/common/constants/app.constant';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  IAM_PACKAGE_NAME,
  IAM_SERVICE_NAME,
  IamServiceClient,
} from '@app/common/types';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class AccessTokenGuard implements CanActivate, OnModuleInit {
  private iamService: IamServiceClient;

  constructor(
    @Inject(IAM_PACKAGE_NAME) private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.iamService =
      this.client.getService<IamServiceClient>(IAM_SERVICE_NAME);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextType = context.getType<'http' | 'ws' | 'rpc'>();

    // Get the request object based on context type
    const request = this.getRequest(context, contextType);

    // Extract token based on context type
    const token = this.extractToken(request, contextType);

    if (!token) {
      throw this.createException(
        contextType,
        'Please provide an access token in the request header',
      );
    }

    try {
      const response = await lastValueFrom(
        this.iamService.authenticate({ token }),
      );

      if (!response.authenticated) {
        throw new Error();
      }

      // Attach user payload to request
      this.attachUser(request, response.payload, contextType, context);
    } catch (error) {
      throw this.createException(contextType, 'Invalid access token provided');
    }

    return true;
  }

  private extractToken(
    request: Request | Socket | Metadata,
    contextType: string,
  ): string | undefined {
    switch (contextType) {
      case 'http':
        return this.extractTokenFromHttpHeader(request as Request);
      case 'ws':
        return this.extractTokenFromWsHeader(request as Socket);
      case 'rpc':
        return this.extractTokenFromGrpcMetadata(request as Metadata);
      default:
        return undefined;
    }
  }

  private extractTokenFromHttpHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }

  private extractTokenFromWsHeader(client: Socket): string | undefined {
    const [_, token] = client.handshake.headers.authorization?.split(' ') ?? [];
    return token;
  }

  private extractTokenFromGrpcMetadata(metadata: Metadata): string | undefined {
    // gRPC metadata keys are case-insensitive
    const authHeader = metadata.get('authorization')[0];
    if (!authHeader || typeof authHeader !== 'string') return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  private createException(contextType: string, message: string): Error {
    switch (contextType) {
      case 'http':
        return new UnauthorizedException(message);
      case 'ws':
        return new WsException(message);
      case 'rpc':
        return new RpcException({
          code: 16,
          message,
        });
      default:
        return new Error(message);
    }
  }

  private getRequest(
    context: ExecutionContext,
    contextType: string,
  ): Request | Socket | any {
    switch (contextType) {
      case 'http':
        return context.switchToHttp().getRequest<Request>();
      case 'ws':
        return context.switchToWs().getClient<Socket>();
      case 'rpc':
        return context.switchToRpc().getContext<Metadata>();
      default:
        throw new Error(`Unsupported context type: ${contextType}`);
    }
  }
  private attachUser(
    request: Request | Socket | any,
    payload: any,
    contextType: string,
    context?: ExecutionContext,
  ): void {
    if (contextType === 'rpc') {
      // For gRPC, attach user data to metadata
      const rpcContext = context.switchToRpc();
      const metadata = rpcContext.getContext<Metadata>();
      // Store user data as JSON string in metadata
      metadata.set(REQUEST_USER_KEY, JSON.stringify(payload));
      return;
    }
    request[REQUEST_USER_KEY] = payload;
  }
}
