import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios from 'axios';
import termiiConfig from 'src/common/config/termii.config';
import { SmsService } from '../sms.service';

@Injectable()
export class TermiiService implements SmsService {
    constructor(
    @Inject(termiiConfig.KEY)
    private readonly termiiConfiguration: ConfigType<typeof termiiConfig>,
  ) {}

  async sendRegistrationVerificationSms(
    phoneNumber: string,
    otp: string,
  ): Promise<void> {
    try {
      // data to send
      const data = {
        to: phoneNumber,
        from: this.termiiConfiguration.senderId,
        sms: `Hi, your OTP is ${otp}. Love Sportboo`,
        type: 'plain',
        channel: 'generic',
        api_key: this.termiiConfiguration.apiKey,
      };

      // make the api call
      const response = await axios.post(
        this.termiiConfiguration.sendSMSURL,
        data,
      );

      // check the response
      if (!(response.status >= 200 && response.status < 300)) {
        throw new Error();
      }
    } catch (error) {
      throw new Error();
    }
  }
}
