import { Module } from '@nestjs/common';
import { P2pBettingServiceController } from './p2p-betting-service.controller';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { P2pBettingServiceService } from './p2p-betting-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/p2p-betting-service/.env', '.env'],
      // validationSchema: ValidationSchema,
    }),
  ],
  controllers: [P2pBettingServiceController],
  providers: [P2pBettingServiceService],
})
export class P2pBettingServiceModule {}
