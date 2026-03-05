import { Test, TestingModule } from '@nestjs/testing';
import { PostmarkEmailService } from './postmark-email.service';

describe('PostmarkEmailService', () => {
  let service: PostmarkEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostmarkEmailService],
    }).compile();

    service = module.get<PostmarkEmailService>(PostmarkEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
