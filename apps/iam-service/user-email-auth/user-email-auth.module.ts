import { Module } from '@nestjs/common';
import { UserEmailAuthService } from './user-email-auth.service';
import { UserEmailAuthController } from './user-email-auth.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [UserEmailAuthController],
  providers: [UserEmailAuthService],
})
export class UserEmailAuthModule {}
