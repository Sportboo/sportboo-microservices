import { Test, TestingModule } from '@nestjs/testing';
import { FileStorageServiceController } from './file-storage-service.controller';
import { FileStorageServiceService } from './file-storage-service.service';

describe('FileStorageServiceController', () => {
  let fileStorageServiceController: FileStorageServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileStorageServiceController],
      providers: [FileStorageServiceService],
    }).compile();

    fileStorageServiceController = app.get<FileStorageServiceController>(FileStorageServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(fileStorageServiceController.getHello()).toBe('Hello World!');
    });
  });
});
