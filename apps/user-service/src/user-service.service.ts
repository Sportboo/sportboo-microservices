import { Injectable } from '@nestjs/common';

@Injectable()
export class UserServiceService {
  getRootPage(): string {
    return `Sportboo User Service is running on port: ${process.env.PORT}`;
  }
}
