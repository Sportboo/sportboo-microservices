import { Injectable } from '@nestjs/common';

@Injectable()
export class SportsDataServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
