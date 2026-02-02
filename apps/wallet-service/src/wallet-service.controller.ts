import { Controller, Get } from '@nestjs/common';
import { WalletServiceService } from './wallet-service.service';

@Controller()
export class WalletServiceController {
  constructor(private readonly walletServiceService: WalletServiceService) {}

  @Get()
  getRootPage(): string {
    return this.walletServiceService.getRootPage();
  }
}
