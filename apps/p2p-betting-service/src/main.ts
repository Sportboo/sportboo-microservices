import { NestFactory } from '@nestjs/core';
import { P2pBettingServiceModule } from './p2p-betting-service.module';

async function bootstrap() {
  const app = await NestFactory.create(P2pBettingServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
