import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserEmailAuthService } from './user-email-auth.service';
import { ActiveUser } from '@app/common/decorators';
import { AuthenticationGuard } from '@app/common';
import { ValidateUsernameDto } from './dto/validate-username.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto';
import { RequestEmailRegistrationOtp } from './dto/request-email-registration-otp.dto';
import { UserPhoneRegistrationDto } from './dto/user-phone-registration.dto';
import { RequestPhoneRegistrationOtp } from './dto/request-phone-registration-otp.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ForgetPasswordOtpDto } from './dto/forget-password-otp.dto';
import { ForgetPasswordVerifyDto } from './dto/forget-password-verify.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('users')
export class UserEmailAuthController {
  constructor(private readonly userEmailAuthService: UserEmailAuthService) {}

  @Post('refresh-token')
  refreshToken(@Body() body: any) {
    return this.userEmailAuthService.refreshToken(body.refreshToken);
  }

  @UseGuards(AuthenticationGuard)
  @Post('logout')
  logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.userEmailAuthService.logout(refreshTokenDto);
  }

  @Post('validate/username')
  validateUsername(@Body() validateUsernameDto: ValidateUsernameDto) {
    return this.userEmailAuthService.validateUsername(validateUsernameDto);
  }

  @Post('login')
  loginUser(@Body() body: UserLoginDto) {
    return this.userEmailAuthService.login(body);
  }

  @Post('register')
  registerUser(@Body() body: UserRegistrationDto) {
    return this.userEmailAuthService.register(body);
  }

  @Post('register/verify')
  verifyEmail(@Body() body: VerifyEmailOtpDto) {
    return this.userEmailAuthService.verifyEmail(body);
  }

  @Post('register/otp')
  requestEmailRegistrationOtp(@Body() body: RequestEmailRegistrationOtp) {
    return this.userEmailAuthService.requestEmailRegistrationOtp(body);
  }

  @Post('register/phone')
  // @UseFilters(new PrismaExceptionFilter())
  registerPhone(@Body() body: UserPhoneRegistrationDto) {
    return this.userEmailAuthService.registerPhone(body);
  }

  @Post('register/phone/verify')
  verifyPhone(@Body() body: VerifyEmailOtpDto) {
    return this.userEmailAuthService.verifyPhone(body);
  }

  @Post('register/phone/otp')
  requestPhoneRegistrationOtp(@Body() body: RequestPhoneRegistrationOtp) {
    return this.userEmailAuthService.requestPhoneRegistrationOtp(body);
  }

  @Post('password/forget')
  forgetPassword(@Body() body: ForgetPasswordDto) {
    return this.userEmailAuthService.forgetPassword(body);
  }

  @Post('password/forget/otp')
  forgetPasswordOtp(@Body() body: ForgetPasswordOtpDto) {
    return this.userEmailAuthService.forgetPasswordOtp(body);
  }

  @Post('password/forget/verify')
  forgetPasswordVerify(@Body() body: ForgetPasswordVerifyDto) {
    return this.userEmailAuthService.forgetPasswordVerify(body);
  }
}
