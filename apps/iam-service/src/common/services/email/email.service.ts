import { Injectable } from '@nestjs/common';
import { EmailMessageRequest } from 'src/common/request/email-message.request';

@Injectable()
export abstract class EmailService {
  abstract sendEmail(message: EmailMessageRequest): Promise<void>;
}
