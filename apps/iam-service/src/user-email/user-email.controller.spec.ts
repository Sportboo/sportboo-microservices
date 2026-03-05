import { Test, TestingModule } from '@nestjs/testing';
import { UserEmailController } from './user-email.controller';
import { UserEmailService } from './user-email.service';

describe('UserEmailController', () => {
  let controller: UserEmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserEmailController],
      providers: [UserEmailService],
    }).compile();

    controller = module.get<UserEmailController>(UserEmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
