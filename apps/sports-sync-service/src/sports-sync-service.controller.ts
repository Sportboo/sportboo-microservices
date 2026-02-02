import { Controller, Get } from '@nestjs/common';
import { SportsSyncServiceService } from './sports-sync-service.service';

@Controller()
export class SportsSyncServiceController {
  constructor(private readonly sportsSyncServiceService: SportsSyncServiceService) {}

  @Get()
  getHello(): string {
    return this.sportsSyncServiceService.getHello();
  }
}
