import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ChatServiceController } from './chat-service.controller';
import { ChatServiceService } from './chat-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/chat-service/.env', '.env'],
      // validationSchema: ValidationSchema,
    }),
  ],
  controllers: [ChatServiceController],
  providers: [ChatServiceService],
})
export class ChatServiceModule {}
