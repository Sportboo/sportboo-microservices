import { Test, TestingModule } from '@nestjs/testing';
import { SmtpEmailService } from './smtp-email.service';

describe('SmtpEmailService', () => {
  let service: SmtpEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmtpEmailService],
    }).compile();

    service = module.get<SmtpEmailService>(SmtpEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
