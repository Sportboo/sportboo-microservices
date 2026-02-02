import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationServiceService {
  getRootPage(): string {
    return `Sportboo Notification Service is running on port: ${process.env.PORT}`;
  }
}
