import { Controller, Get } from '@nestjs/common';
import { SportsDataServiceService } from './sports-data-service.service';

@Controller()
export class SportsDataServiceController {
  constructor(private readonly sportsDataServiceService: SportsDataServiceService) {}

  @Get()
  getRootPage(): string {
    return this.sportsDataServiceService.getRootPage();
  }
}
