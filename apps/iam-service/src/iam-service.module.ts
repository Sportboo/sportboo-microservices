import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { IamServiceController } from './iam-service.controller';
import { IamServiceService } from './iam-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/chat-service/.env', '.env'],
      // validationSchema: ValidationSchema,
    }),
  ],
  controllers: [IamServiceController],
  providers: [IamServiceService],
})
export class IamServiceModule {}
