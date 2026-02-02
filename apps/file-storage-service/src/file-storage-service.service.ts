import { Injectable } from '@nestjs/common';

@Injectable()
export class FileStorageServiceService {
  getRootPage(): string {
    return `Sportboo File Storage Service is running on port: ${process.env.PORT}`;
  }
}
