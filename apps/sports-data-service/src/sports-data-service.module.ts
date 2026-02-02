import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SportsDataServiceController } from './sports-data-service.controller';
import { SportsDataServiceService } from './sports-data-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/sports-data-service/.env', '.env'],
    }),
  ],
  controllers: [SportsDataServiceController],
  providers: [SportsDataServiceService],
})
export class SportsDataServiceModule {}
