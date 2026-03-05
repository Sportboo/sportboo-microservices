import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { IamServiceController } from './iam-service.controller';
import { IamServiceService } from './iam-service.service';
import { AdminsModule } from './admins/admins.module';
import { UserEmailModule } from './user-email/user-email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/chat-service/.env', '.env'],
      // validationSchema: ValidationSchema,
    }),
    AdminsModule,
    UserEmailModule,
  ],
  controllers: [IamServiceController],
  providers: [IamServiceService],
})
export class IamServiceModule {}
