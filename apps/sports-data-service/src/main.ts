import { NestFactory } from '@nestjs/core';
import { SportsDataServiceModule } from './sports-data-service.module';

async function bootstrap() {
  const app = await NestFactory.create(SportsDataServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
