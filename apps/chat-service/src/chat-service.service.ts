import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatServiceService {
  getRootPage(): string {
    return `Sportboo Chat Service is running on port: ${process.env.PORT}`;
  }
}
