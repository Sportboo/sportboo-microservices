import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../../decorators/roles.decorator';
import { REQUEST_USER_KEY } from '@app/common/constants/app.constant';
import { ActiveUserData } from '@app/common/interfaces/active-user-data.interface';
import { Metadata } from '@grpc/grpc-js';
import Role from '@app/common/enums/role.enum';
import { WsException } from '@nestjs/websockets';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextRole = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!contextRole) {
      return true;
    }

    const contextType = context.getType<'http' | 'ws' | 'rpc'>();

    // Get user based on context type
    const user = this.getUserFromContext(context);

    if (!user) {
      throw this.createException(contextType, 'User not authenticated');
    }

    const hasRole = contextRole.some((role) => user.role === role);

    if (!hasRole) {
      const rolesList = contextRole.join(', ');
      throw this.createException(
        contextType,
        `Only users with the following roles can access this resource: ${rolesList}. Your role: ${user.role}`,
      );
    }

    return true;
  }

  private getUserFromContext(context: ExecutionContext): ActiveUserData | null {
    const contextType = context.getType();

    switch (contextType) {
      case 'http':
        return this.getUserFromHttp(context);
      case 'rpc':
        return this.getUserFromRpc(context);
      case 'ws':
        return this.getUserFromWs(context);
      default:
        throw new ForbiddenException(
          `Unsupported context type: ${contextType}`,
        );
    }
  }

  private getUserFromHttp(context: ExecutionContext): ActiveUserData | null {
    const request = context.switchToHttp().getRequest();
    return request[REQUEST_USER_KEY] || null;
  }

  private getUserFromRpc(context: ExecutionContext): ActiveUserData | null {
    const metadata = context.switchToRpc().getContext<Metadata>();
    const userData = metadata.get(REQUEST_USER_KEY)[0];

    if (userData && typeof userData === 'string') {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Failed to parse user data from metadata:', error);
        return null;
      }
    }
  }

  private getUserFromWs(context: ExecutionContext): ActiveUserData | null {
    const client = context.switchToWs().getClient();
    // For WebSocket, user is typically attached to the client/socket
    // Access via handshake data or client data depending on your auth setup
    return (
      client[REQUEST_USER_KEY] ||
      client?.data?.[REQUEST_USER_KEY] ||
      client?.handshake?.[REQUEST_USER_KEY] ||
      client?.user ||
      null
    );
  }

  private createException(contextType: string, message: string): Error {
    switch (contextType) {
      case 'http':
        return new ForbiddenException(message);
      case 'ws':
        return new WsException(message);
      case 'rpc':
        return new RpcException({
          code: 7, // UNAUTHENTICATED in gRPC
          message,
        });
      default:
        return new Error(message);
    }
  }
}

// import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';
// import { ROLES_KEY } from '../../decorators/roles.decorator';
// import Role from '@app/common/enums/role.enum';
// import { REQUEST_USER_KEY } from '@app/common/constants/app.constant';
// import { ActiveUserData } from '@app/common/interfaces/active-user-data.interface';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private readonly reflector: Reflector){}
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const contextRole = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ])

//     if(!contextRole) {
//       return true;
//     }

//     const user: ActiveUserData = context.switchToHttp().getRequest() [
//       REQUEST_USER_KEY
//     ]

//     const hasRole = contextRole.some((role) => user.role === role);

//     if (!hasRole) {
//       const rolesList = contextRole.join(', ');
//       throw new ForbiddenException(
//         `Only users with the following roles can access this resource: ${rolesList}. Your role: ${user.role}`,
//       );
//     }

//     return true;

//   }
// }
