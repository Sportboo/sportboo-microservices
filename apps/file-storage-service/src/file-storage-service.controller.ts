import { Controller, Get } from '@nestjs/common';
import { FileStorageServiceService } from './file-storage-service.service';

@Controller()
export class FileStorageServiceController {
  constructor(private readonly fileStorageServiceService: FileStorageServiceService) {}

  @Get()
  getRootPage(): string {
    return this.fileStorageServiceService.getRootPage();
  }
}
