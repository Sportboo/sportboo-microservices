import { Module } from '@nestjs/common';
import { SportsDataServiceController } from './sports-data-service.controller';
import { SportsDataServiceService } from './sports-data-service.service';

@Module({
  imports: [],
  controllers: [SportsDataServiceController],
  providers: [SportsDataServiceService],
})
export class SportsDataServiceModule {}
