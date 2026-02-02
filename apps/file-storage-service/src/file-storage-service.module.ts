import { Module } from '@nestjs/common';
import { FileStorageServiceController } from './file-storage-service.controller';
import { FileStorageServiceService } from './file-storage-service.service';

@Module({
  imports: [],
  controllers: [FileStorageServiceController],
  providers: [FileStorageServiceService],
})
export class FileStorageServiceModule {}
