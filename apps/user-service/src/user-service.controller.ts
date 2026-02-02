import { Controller, Get } from '@nestjs/common';
import { UserServiceService } from './user-service.service';

@Controller()
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @Get()
  getRootPage(): string {
    return this.userServiceService.getRootPage();
  }
}
