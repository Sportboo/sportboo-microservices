import { Module } from '@nestjs/common';
import { SportsSyncServiceController } from './sports-sync-service.controller';
import { SportsSyncServiceService } from './sports-sync-service.service';

@Module({
  imports: [],
  controllers: [SportsSyncServiceController],
  providers: [SportsSyncServiceService],
})
export class SportsSyncServiceModule {}
