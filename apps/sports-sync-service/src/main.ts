import { NestFactory } from '@nestjs/core';
import { SportsSyncServiceModule } from './sports-sync-service.module';

async function bootstrap() {
  const app = await NestFactory.create(SportsSyncServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
