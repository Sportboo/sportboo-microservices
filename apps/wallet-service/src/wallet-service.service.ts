import { Injectable } from '@nestjs/common';

@Injectable()
export class WalletServiceService {
  getRootPage(): string {
    return `Sportboo Wallet Service is running on port: ${process.env.PORT}`;
  }
}
