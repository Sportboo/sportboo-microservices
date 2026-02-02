import { Test, TestingModule } from '@nestjs/testing';
import { UserEmailAuthService } from './user-email-auth.service';

describe('UserEmailAuthService', () => {
  let service: UserEmailAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserEmailAuthService],
    }).compile();

    service = module.get<UserEmailAuthService>(UserEmailAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
