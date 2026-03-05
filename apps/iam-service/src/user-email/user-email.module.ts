import { Module } from '@nestjs/common';
import { UserEmailService } from './user-email.service';
import { UserEmailController } from './user-email.controller';

@Module({
  controllers: [UserEmailController],
  providers: [UserEmailService],
})
export class UserEmailModule {}
