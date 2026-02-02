import { NestFactory } from '@nestjs/core';
import { FileStorageServiceModule } from './file-storage-service.module';

async function bootstrap() {
  const app = await NestFactory.create(FileStorageServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
