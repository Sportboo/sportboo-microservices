import { Injectable } from '@nestjs/common';

@Injectable()
export class SportsDataServiceService {
  getRootPage(): string {
    return `Sportboo Sports Data Service is running on port: ${process.env.PORT}`;
  }
}
