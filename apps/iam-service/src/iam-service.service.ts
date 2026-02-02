import { Injectable } from '@nestjs/common';

@Injectable()
export class IamServiceService {
  getRootPage(): string {
    return `Sportboo IAM Service is running on port: ${process.env.PORT}`;
  }
}
