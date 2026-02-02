import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import appConfig from './config/app.config';
import { PrismaService } from './services/prisma/prisma.service';
import { HelperService } from './services/helper/helper.service';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenGuard } from '@app/common/guards';
import { HashingService } from './services/hashing/hashing.service';
import { BcryptService } from './services/hashing/bcrypt.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IAM_PACKAGE_NAME } from '@app/common/types';
import iamServiceGrpcConfig from '@app/core/config/iam-service-grpc.config';
import { NOTIFICATION_SERVICE_RABITMQ } from '@app/common';
import rabbitMqConfig from '@app/core/config/rabbit-mq.config';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(appConfig),
    ClientsModule.registerAsync([
      {
        name: IAM_PACKAGE_NAME,
        imports: [ConfigModule.forFeature(iamServiceGrpcConfig)],
        useFactory: async (
          iamServiceGrpcConfiguration: ConfigType<typeof iamServiceGrpcConfig>,
        ) => {
          return {
            transport: Transport.GRPC,
            options: {
              package: IAM_PACKAGE_NAME,
              protoPath: 'proto/iam.proto',
              url: iamServiceGrpcConfiguration.url,
            },
          };
        },
        inject: [iamServiceGrpcConfig.KEY],
      },
      {
        name: NOTIFICATION_SERVICE_RABITMQ,
        imports: [ConfigModule.forFeature(rabbitMqConfig)],
        useFactory: async (
          rabbitMqConfiguration: ConfigType<typeof rabbitMqConfig>,
        ) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitMqConfiguration.url],
              queue: 'notification_queue',
              queueOptions: {
                durable: false,
              },
            },
          };
        },
        inject: [rabbitMqConfig.KEY],
      },
    ]),
  ],
  providers: [
    PrismaService,
    HelperService,
    JwtService,
    AccessTokenGuard,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  exports: [
    ConfigModule.forFeature(appConfig),
    PrismaService,
    HelperService,
    JwtService,
    AccessTokenGuard,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    ClientsModule.registerAsync([
      {
        name: IAM_PACKAGE_NAME,
        imports: [ConfigModule.forFeature(iamServiceGrpcConfig)],
        useFactory: async (
          iamServiceGrpcConfiguration: ConfigType<typeof iamServiceGrpcConfig>,
        ) => {
          return {
            transport: Transport.GRPC,
            options: {
              package: IAM_PACKAGE_NAME,
              protoPath: 'proto/iam.proto',
              url: iamServiceGrpcConfiguration.url,
            },
          };
        },
        inject: [iamServiceGrpcConfig.KEY],
      },
      {
        name: NOTIFICATION_SERVICE_RABITMQ,
        imports: [ConfigModule.forFeature(rabbitMqConfig)],
        useFactory: async (
          rabbitMqConfiguration: ConfigType<typeof rabbitMqConfig>,
        ) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitMqConfiguration.url],
              queue: 'notification_queue',
              queueOptions: {
                durable: false,
              },
            },
          };
        },
        inject: [rabbitMqConfig.KEY],
      },
    ]),
  ],
})
export class CommonModule {}
