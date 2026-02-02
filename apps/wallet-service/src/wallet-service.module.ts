import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WalletServiceController } from './wallet-service.controller';
import { WalletServiceService } from './wallet-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/wallet-service/.env', '.env'],
    }),
  ],
  controllers: [WalletServiceController],
  providers: [WalletServiceService],
})
export class WalletServiceModule {}
