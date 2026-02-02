import { Test, TestingModule } from '@nestjs/testing';
import { UserEmailAuthController } from './user-email-auth.controller';
import { UserEmailAuthService } from './user-email-auth.service';

describe('UserEmailAuthController', () => {
  let controller: UserEmailAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserEmailAuthController],
      providers: [UserEmailAuthService],
    }).compile();

    controller = module.get<UserEmailAuthController>(UserEmailAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
