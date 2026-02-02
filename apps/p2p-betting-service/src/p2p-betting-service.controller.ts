import { Controller, Get } from '@nestjs/common';
import { P2pBettingServiceService } from './p2p-betting-service.service';

@Controller()
export class P2pBettingServiceController {
  constructor(private readonly p2pBettingServiceService: P2pBettingServiceService) {}

  @Get()
  getHello(): string {
    return this.p2pBettingServiceService.getHello();
  }
}
