import { Test, TestingModule } from '@nestjs/testing';
import { SportsDataServiceController } from './sports-data-service.controller';
import { SportsDataServiceService } from './sports-data-service.service';

describe('SportsDataServiceController', () => {
  let sportsDataServiceController: SportsDataServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SportsDataServiceController],
      providers: [SportsDataServiceService],
    }).compile();

    sportsDataServiceController = app.get<SportsDataServiceController>(SportsDataServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(sportsDataServiceController.getHello()).toBe('Hello World!');
    });
  });
});
