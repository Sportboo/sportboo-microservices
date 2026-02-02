import { Module } from '@nestjs/common';
import { P2pBettingServiceController } from './p2p-betting-service.controller';
import { P2pBettingServiceService } from './p2p-betting-service.service';

@Module({
  imports: [],
  controllers: [P2pBettingServiceController],
  providers: [P2pBettingServiceService],
})
export class P2pBettingServiceModule {}
