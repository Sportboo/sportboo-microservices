import { Inject, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Client } from 'postmark';
import postmarkConfig from 'src/common/config/postmark.config';
import { EmailService } from '../email.service';
import { EmailMessageRequest } from 'src/common/request/email-message.request';

@Injectable()
export class PostmarkEmailService implements EmailService {
  async sendResetPasswordOtpEmail(email: string, fullname: string, otp: string) {
    throw new Error('Method not implemented.');
  }

  private readonly logger: Logger = new Logger(EmailService.name);
  private readonly client: Client;

  constructor(
    @Inject(postmarkConfig.KEY)
    private readonly paystackConfiguration: ConfigType<typeof postmarkConfig>,
  ) {
    this.client = new Client(this.paystackConfiguration.apiKey);
  }
  sendEmail(message: EmailMessageRequest): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // async sendUserRegistrationEmail(
  //   email: string,
  //   name: string,
  //   otp: string,
  // ): Promise<void> {
  //   try {
  //     await this.client.sendEmailWithTemplate({
  //       From: 'edd@sablogistics.com.ng',
  //       To: email,
  //       TemplateAlias: 'password-reset',
  //       TemplateModel: {
  //         product_url: 'https://www.google.com',
  //         product_name: 'Sportboo',
  //         name: name,
  //         otp: otp,
  //         support_url: 'https://www.google.com',
  //         company_name: 'Sportboo',
  //         company_address: 'Lagos Nigeria',
  //       },
  //     });
  //   } catch (error) {
  //     this.logger.log(error);
  //     throw new ServiceUnavailableException();
  //   }
  // }

  // async sendInvitationEmail(email: string, message: string): Promise<void> {
  //   try {
  //     await this.client.sendEmailWithTemplate({
  //       From: 'edd@sablogistics.com.ng',
  //       To: email,
  //       TemplateAlias: 'password-reset',
  //       TemplateModel: {
  //         product_url: 'https://www.google.com',
  //         product_name: 'Sportboo',
  //         name: '',
  //         otp: message,
  //         support_url: 'https://www.google.com',
  //         company_name: 'Sportboo',
  //         company_address: 'Lagos Nigeria',
  //       },
  //     });
  //   } catch (error) {
  //     this.logger.log(error);
  //   }
  // }
  
}
