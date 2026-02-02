import { Test, TestingModule } from '@nestjs/testing';
import { P2pBettingServiceController } from './p2p-betting-service.controller';
import { P2pBettingServiceService } from './p2p-betting-service.service';

describe('P2pBettingServiceController', () => {
  let p2pBettingServiceController: P2pBettingServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [P2pBettingServiceController],
      providers: [P2pBettingServiceService],
    }).compile();

    p2pBettingServiceController = app.get<P2pBettingServiceController>(P2pBettingServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(p2pBettingServiceController.getHello()).toBe('Hello World!');
    });
  });
});
