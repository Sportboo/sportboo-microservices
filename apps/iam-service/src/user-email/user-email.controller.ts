import { Controller, Post, Body, Req } from '@nestjs/common';
import { UserEmailService } from './user-email.service';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiGoneResponse, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ExceptionResponse } from '@app/common';
import { ValidateUsernameDto } from './dto/validate-username.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto';
import { RequestEmailRegistrationOtp } from './dto/request-email-registration-otp.dto';
import { UserPhoneRegistrationDto } from './dto/user-phone-registration.dto';
import { RequestPhoneRegistrationOtp } from './dto/request-phone-registration-otp.dto';
import { ForgetPasswordOtpDto } from './dto/forget-password-otp.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ForgetPasswordVerifyDto } from './dto/forget-password-verify.dto';

@Controller('iam/users')
export class UserEmailController {
  constructor(private readonly userEmailService: UserEmailService) {}

 
   /*
  this endpoint generate a refresh token
  */
  @ApiCreatedResponse({
    description:
      'The request was succcessfull and refresh token was created and returned',
  })
  @ApiUnauthorizedResponse({
    description: 'invalid token',
    type: ExceptionResponse,
  })
  @Post('refresh-token')
  refreshToken(@Body() body: any) {
    return this.userEmailService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  logout(@Req() request: any) {
    return this.userEmailService.logout(request.auth);
  }

  @Post('validate/username')
  validateUsername(@Body() validateUsernameDto: ValidateUsernameDto) {
    return this.userEmailService.validateUsername(validateUsernameDto);
  }

  /*
  this endpoint logs user in
  */
  @ApiBody({ description: 'request object', type: UserLoginDto })
  @ApiOkResponse({
    description: 'The request was successfull and user was logged in',
    type: UserLoginDto,
  })
  @ApiNotFoundResponse({
    description:
      'user does not exist or user password does not match hashedPassword',
    type: ExceptionResponse,
  })
  @ApiBadRequestResponse({
    description: 'user email has not been verified',
    type: ExceptionResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'user email has not been verified',
    type: ExceptionResponse,
  })
  @Post('login')
  loginUser(@Body() body: UserLoginDto) {
    return this.userEmailService.login(body);
  }

  // @Post('google')
  // googleLogin(@Body() body: GoogleLoginDto) {
  //   return this.userEmailService.googleLogin(body);
  // }

  // @Post('facebook')
  // facebookLogin(@Body() body: GoogleLoginDto) {
  //   return this.userEmailService.googleLogin(body);
  // }

  /*
  this endpoint registers new user
  */
  @ApiBody({ description: 'request object', type: UserRegistrationDto })
  @ApiCreatedResponse({
    description:
      'The request was successfull and user was created and returned',
    type: UserRegistrationDto,
  })
  @ApiBadRequestResponse({
    description: 'user email has not been verified',
    type: ExceptionResponse,
  })
  @ApiConflictResponse({
    description: 'user already exist or userName already exist',
    type: ExceptionResponse,
  })
  @Post('register')
  registerUser(@Body() body: UserRegistrationDto) {
    return this.userEmailService.register(body);
  }

  /*
  this endpoint verifies user email
  */
  @ApiBody({ description: 'request object', type: VerifyEmailOtpDto })
  @ApiOkResponse({
    description: 'The request was successfull and user email was verified',
    type: VerifyEmailOtpDto,
  })
  @ApiBadRequestResponse({
    description: 'invalid otp',
    type: ExceptionResponse,
  })
  @ApiGoneResponse({ description: 'otp expired', type: ExceptionResponse })
  @Post('register/verify')
  verifyEmail(@Body() body: VerifyEmailOtpDto) {
    return this.userEmailService.verifyEmail(body);
  }

  /*
  this endpoint sends otp to email
  */
  @ApiBody({ description: 'request object', type: RequestEmailRegistrationOtp })
  @ApiOkResponse({
    description: 'The request was successfull and otp sent to email',
    type: RequestEmailRegistrationOtp,
  })
  @ApiNotFoundResponse({
    description: 'user not found',
    type: ExceptionResponse,
  })
  @ApiUnauthorizedResponse({
    description:
      'this response is returned when unauthenticated user makes a request to the endpoint',
    type: ExceptionResponse,
  })
  @Post('register/otp')
  requestEmailRegistrationOtp(@Body() body: RequestEmailRegistrationOtp) {
    return this.userEmailService.requestEmailRegistrationOtp(body);
  }

  /*
  this endpoint sends otp to phone number
  */
  @ApiBody({ description: 'request object', type: UserPhoneRegistrationDto })
  @ApiOkResponse({
    description: 'The request was successfull and otp was sent',
    type: UserPhoneRegistrationDto,
  })
  @ApiNotFoundResponse({
    description: 'user not found',
    type: ExceptionResponse,
  })
  @ApiUnauthorizedResponse({
    description:
      'this response is returned when unauthenticated user makes a request to the endpoint',
    type: ExceptionResponse,
  })
  @Post('register/phone')
  // @UseFilters(new PrismaExceptionFilter())
  registerPhone(@Body() body: UserPhoneRegistrationDto) {
    return this.userEmailService.registerPhone(body);
  }

  /*
  this endpoint verifies user phone number
  */
  @ApiBody({ description: 'request object', type: VerifyEmailOtpDto })
  @ApiOkResponse({
    description:
      'The request was successfull and user phone number was verified',
    type: VerifyEmailOtpDto,
  })
  @ApiBadRequestResponse({
    description: 'invalid Otp',
    type: ExceptionResponse,
  })
  @ApiGoneResponse({ description: 'otp expired', type: ExceptionResponse })
  @Post('register/phone/verify')
  verifyPhone(@Body() body: VerifyEmailOtpDto) {
    return this.userEmailService.verifyPhone(body);
  }

  /*
  this endpoint request phone registration
  */
  @ApiBody({ description: 'request object', type: RequestPhoneRegistrationOtp })
  @ApiOkResponse({
    description: 'The request was successfull ',
    type: RequestPhoneRegistrationOtp,
  })
  @ApiNotFoundResponse({
    description: 'user not found',
    type: ExceptionResponse,
  })
  @Post('register/phone/otp')
  requestPhoneRegistrationOtp(@Body() body: RequestPhoneRegistrationOtp) {
    return this.userEmailService.requestPhoneRegistrationOtp(body);
  }

  /*
  this endpoint reset user password
  */
  @ApiBody({ description: 'request object', type: ForgetPasswordOtpDto })
  @ApiOkResponse({
    description: 'Pasword reset successful, please proceed to login',
    type: ForgetPasswordOtpDto,
  })
  @ApiBadRequestResponse({
    description: 'otp has not been verified',
    type: ExceptionResponse,
  })
  @Post('password/forget')
  forgetPassword(@Body() body: ForgetPasswordDto) {
    return this.userEmailService.forgetPassword(body);
  }

  /*
  this endpoint request for forgetPassword otp
  */
  @ApiBody({ description: 'request object', type: ForgetPasswordOtpDto })
  @ApiOkResponse({
    description: 'The request was successfull and otp was sent',
    type: ForgetPasswordOtpDto,
  })
  @ApiBadRequestResponse({
    description: 'You are to provide either an email or a phone number',
    type: ExceptionResponse,
  })
  @ApiNotFoundResponse({
    description: 'user not found',
    type: ExceptionResponse,
  })
  @Post('password/forget/otp')
  forgetPasswordOtp(@Body() body: ForgetPasswordOtpDto) {
    return this.userEmailService.forgetPasswordOtp(body);
  }

  /*
  this endpoint verifies otp
  */
  @ApiBody({ description: 'request object', type: ForgetPasswordVerifyDto })
  @ApiOkResponse({
    description: 'The request was successfull and otp verified',
    type: ForgetPasswordVerifyDto,
  })
  @ApiBadRequestResponse({
    description: 'invalid otp',
    type: ExceptionResponse,
  })
  @ApiGoneResponse({ description: 'otp has expired', type: ExceptionResponse })
  @Post('password/forget/verify')
  forgetPasswordVerify(@Body() body: ForgetPasswordVerifyDto) {
    return this.userEmailService.forgetPasswordVerify(body);
  }
}
