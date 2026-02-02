import { Test, TestingModule } from '@nestjs/testing';
import { SportsSyncServiceController } from './sports-sync-service.controller';
import { SportsSyncServiceService } from './sports-sync-service.service';

describe('SportsSyncServiceController', () => {
  let sportsSyncServiceController: SportsSyncServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SportsSyncServiceController],
      providers: [SportsSyncServiceService],
    }).compile();

    sportsSyncServiceController = app.get<SportsSyncServiceController>(SportsSyncServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(sportsSyncServiceController.getHello()).toBe('Hello World!');
    });
  });
});
