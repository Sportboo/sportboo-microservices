import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileStorageServiceController } from './file-storage-service.controller';
import { FileStorageServiceService } from './file-storage-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/file-storage-service/.env', '.env'],
    }),
  ],
  controllers: [FileStorageServiceController],
  providers: [FileStorageServiceService],
})
export class FileStorageServiceModule {}
