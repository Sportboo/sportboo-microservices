import { Injectable } from '@nestjs/common';
import {
  EMAIL_REGISTRATION_OTP_DURATION_MINUTE,
  FORGET_PASSWORD_OTP_DURATION_MINUTE,
  PHONE_REGISTRATION_OTP_DURATION_MINUTE,
  TRANSACTION_OTP_DURATION_MINUTE,
} from 'src/common/constants/otp.constant';
import { OtpType } from 'src/common/enums';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OtpService {
  constructor(private readonly prismaService: PrismaService) {}

  public async generateEmailRegistrationOtp(userId: number): Promise<string> {
    const now = new Date();
    // create the otp
    const otp = await this.prismaService.otp.create({
      data: {
        userId,
        type: OtpType.EmailRegistration,
        value: this.generateOtp(),
        verified: false,
        expiresAt: new Date(
          now.getTime() + EMAIL_REGISTRATION_OTP_DURATION_MINUTE * 60 * 1000,
        ),
      },
    });

    return otp.value;
  }

  public async generateUserForgetPasswordOtp(userId: number): Promise<string> {
    const now = new Date();

    // create the otp
    const otp = await this.prismaService.otp.create({
      data: {
        userId,
        type: OtpType.ForgetUserPasswordOtp,
        value: this.generateOtp(),
        verified: false,
        expiresAt: new Date(
          now.getTime() + FORGET_PASSWORD_OTP_DURATION_MINUTE * 60 * 1000,
        ),
      },
    });

    return otp.value;
  }

  public async generateFiatTransactionWithdrawalOtp(
    userId: number,
  ): Promise<string> {
    const now = new Date();

    // create the otp
    const otp = await this.prismaService.otp.create({
      data: {
        userId,
        type: OtpType.FiatTransactionWithdrawal,
        value: this.generateOtp(),
        verified: false,
        expiresAt: new Date(
          now.getTime() + TRANSACTION_OTP_DURATION_MINUTE * 60 * 1000,
        ),
      },
    });

    return otp.value;
  }

  public async generateUserPhoneRegistrationOtp(
    userId: number,
  ): Promise<string> {
    const now = new Date();

    // create the otp
    const otp = await this.prismaService.otp.create({
      data: {
        userId,
        type: OtpType.PhoneRegistration,
        value: this.generateOtp(),
        verified: false,
        expiresAt: new Date(now.getTime() + PHONE_REGISTRATION_OTP_DURATION_MINUTE * 60 * 1000,),
      },
    });

    return otp.value;
  }

  public async generateFiatTransactionTransferOtp(
    userId: number,
  ): Promise<string> {
    const now = new Date()

    // create the otp
    const otp = await this.prismaService.otp.create({
      data: {
        userId,
        type: OtpType.FiatTransactionTransfer,
        value: this.generateOtp(),
        verified: false,
        expiresAt: new Date(now.getTime() + TRANSACTION_OTP_DURATION_MINUTE * 60 * 1000,),
      },
    });

    return otp.value;
  }

  public async generateCryptoTransactionWithdrawalOtp(
    userId: number,
  ): Promise<string> {
const now = new Date()

    // create the otp
    const otp = await this.prismaService.otp.create({
      data: {
        userId,
        type: OtpType.CryptoTransactionWithdrawal,
        value: this.generateOtp(),
        verified: false,
        expiresAt: new Date(now.getTime() + TRANSACTION_OTP_DURATION_MINUTE * 60 * 1000,),
      },
    });

    return otp.value;
  }

  public async generateCryptoTransactionTransferOtp(
    userId: number,
  ): Promise<string> {
    const now = new Date()

    // create the otp
    const otp = await this.prismaService.otp.create({
      data: {
        userId,
        type: OtpType.CryptoTransactionTransfer,
        value: this.generateOtp(),
        verified: false,
        expiresAt: new Date(now.getTime() + TRANSACTION_OTP_DURATION_MINUTE * 60 * 1000,),
      },
    });

    return otp.value;
  }

  public async generateAdminForgetPasswordOtp(userId: number): Promise<string> {
    const now = new Date()
    // create the otp
    const otp = await this.prismaService.otp.create({
      data: {
        userId,
        type: OtpType.ForgetAdminPasswordOtp,
        value: this.generateOtp(),
        verified: false,
        expiresAt: new Date(now.getTime() + FORGET_PASSWORD_OTP_DURATION_MINUTE * 60 * 1000,),
      },
    });

    return otp.value;
  }

  public async generateAdminPhoneRegistrationOtp(userId: number): Promise<string> {
    const now = new Date()

    // create the otp
    const otp = await this.prismaService.otp.create({
      data: {
        userId,
        type: OtpType.PhoneRegistration,
        value: this.generateOtp(),
        verified: false,
        expiresAt: new Date(now.getTime() + PHONE_REGISTRATION_OTP_DURATION_MINUTE * 60 * 1000,),
      },
    });

    return otp.value;
  }

  private generateOtp(): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 4; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }
  
}
