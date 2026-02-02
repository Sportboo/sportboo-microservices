import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SportsSyncServiceController } from './sports-sync-service.controller';
import { SportsSyncServiceService } from './sports-sync-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/sports-sync-service/.env', '.env'],
    }),
  ],
  controllers: [SportsSyncServiceController],
  providers: [SportsSyncServiceService],
})
export class SportsSyncServiceModule {}
