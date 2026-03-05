import { Inject, Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../email.service';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import smtpEmailConfig from 'src/common/config/smtp-email.config';
import { EmailMessageRequest } from 'src/common/request/email-message.request';

@Injectable()
export class SmtpEmailService implements EmailService {
  private readonly logger = new Logger(SmtpEmailService.name);
  private transporter: Transporter;

  constructor(
    @Inject(smtpEmailConfig.KEY)
    private readonly smtpEmailConfiguration: ConfigType<typeof smtpEmailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: smtpEmailConfiguration.host,
      port: smtpEmailConfiguration.port,
      secure: true,
      auth: {
        user: smtpEmailConfiguration.user,
        pass: smtpEmailConfiguration.password,
      },
    });

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Email transporter verification failed', error);
      } else {
        this.logger.log('Email transporter is ready', success);
      }
    });
  }

  async sendEmail(message: EmailMessageRequest): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"${message.caption ?? 'Sportboo Team'}" <${this.smtpEmailConfiguration.user}>`,
        to: message.to,
        subject: message.subject,
        text: message.textBody,
        html: message.htmlBody,
      });
    } catch (error) {
      // log email sending failure
      console.log('Email sending failed:', error)
    }
  }

}
