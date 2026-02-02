import { Injectable } from '@nestjs/common';

@Injectable()
export class FileStorageServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
