import { Injectable } from '@nestjs/common';

@Injectable()
export class SportsSyncServiceService {
  getRootPage(): string {
    return `Sportboo Sports Sync Service is running on port: ${process.env.PORT}`;
  }
}
