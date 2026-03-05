import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { UserProfileModule } from './user-profile/user-profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/user-service/.env', '.env'],
      // validationSchema: ValidationSchema,
    }),
    UserProfileModule,
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
