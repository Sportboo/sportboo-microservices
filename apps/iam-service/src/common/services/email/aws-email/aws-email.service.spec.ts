import { Test, TestingModule } from '@nestjs/testing';
import { AwsEmailService } from './aws-email.service';

describe('AwsEmailService', () => {
  let service: AwsEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsEmailService],
    }).compile();

    service = module.get<AwsEmailService>(AwsEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
