import { Controller, Get } from '@nestjs/common';
import { SportsDataServiceService } from './sports-data-service.service';

@Controller()
export class SportsDataServiceController {
  constructor(private readonly sportsDataServiceService: SportsDataServiceService) {}

  @Get()
  getHello(): string {
    return this.sportsDataServiceService.getHello();
  }
}
