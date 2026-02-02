import { Injectable } from '@nestjs/common';

@Injectable()
export class P2pBettingServiceService {
  getRootPage(): string {
    return `Sportboo User Service is running on port: ${process.env.PORT}`;
  }
}
