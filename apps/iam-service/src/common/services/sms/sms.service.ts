import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export abstract class SmsService {

  abstract sendRegistrationVerificationSms(
    phoneNumber: string,
    otp: string,
  ): Promise<void>;
}
