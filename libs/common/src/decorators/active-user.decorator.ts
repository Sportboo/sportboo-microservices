import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import { REQUEST_USER_KEY } from '../constants/app.constant';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { Metadata } from '@grpc/grpc-js';

/**
 * Decorator to extract active user data from HTTP, WebSocket, or gRPC context
 *
 * Usage:
 * @Get('profile')
 * getProfile(@ActiveUser() user: ActiveUserData) {
 *   return user;
 * }
 *
 * @GrpcMethod('UserService', 'GetProfile')
 * getProfile(@ActiveUser() user: ActiveUserData, @Payload() data: any) {
 *   return user;
 * }
 */
export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, context: ExecutionContext) => {
    const contextType = context.getType<'http' | 'ws' | 'rpc'>();

    let user: ActiveUserData;

    switch (contextType) {
      case 'http':
        const request = context.switchToHttp().getRequest<Request>();
        user = request[REQUEST_USER_KEY];
        break;

      case 'ws':
        const socket = context.switchToWs().getClient<Socket>();
        user = socket[REQUEST_USER_KEY];
        break;

      case 'rpc':
        // const rpcData = context.switchToRpc().getData();
        // user = rpcData[REQUEST_USER_KEY];
        // break;

        const metadata = context.switchToRpc().getContext<Metadata>();
        const userData = metadata.get(REQUEST_USER_KEY)[0];

        if (userData && typeof userData === 'string') {
          try {
            user = JSON.parse(userData);
          } catch (error) {
            console.error('Failed to parse user data from metadata:', error);
            user = null;
          }
        }
        break;

      default:
        return null;
    }

    // Return specific field if requested, otherwise return entire user object
    return field ? user?.[field] : user;
  },
);

// export const ActiveUser = createParamDecorator(
//   (field: keyof ActiveUserData | undefined, context: ExecutionContext) => {
//     const request: Request | Socket =
//       context.getType() === 'http'
//         ? context.switchToHttp().getRequest()
//         : context.switchToWs().getClient();

//     const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];
//     return field ? user?.[field] : user;
//   },
// );
