/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-constant-condition */
import { BadRequestException, ConflictException, GoneException, Inject, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HashingService } from '../common/services/hashing/hashing.service';
import { HelperService } from '../common/services/helper/helper.service';
import { PrismaService } from '../common/services/prisma/prisma.service';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../common/config/jwt.config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ForgetPasswordOtpDto } from './dto/forget-password-otp.dto';
import { ForgetPasswordVerifyDto } from './dto/forget-password-verify.dto';
import { ActiveUserData } from '@app/common';
import { randomUUID } from 'crypto';
import AuthTokenType from '@app/common/enums/auth-token-type.enum';
import { JwtService } from '@nestjs/jwt';
import { ValidateUsernameDto } from './dto/validate-username.dto';
import { UserLoginDto } from './dto/user-login.dto';
import Role from '@app/common/enums/role.enum';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { UserRegistrationEmailTemplate } from '../common/email-templates/user-registration-email-template';
import { EmailService } from '../common/services/email/email.service';
import { SmsService } from '../common/services/sms/sms.service';
import { OtpService } from '../common/services/otp/otp.service';
import { OtpType } from '../common/enums';
import { RequestEmailRegistrationOtp } from './dto/request-email-registration-otp.dto';
import { RequestRegistrationEmailTemplate } from '../common/email-templates/request-registration-email-template';
import { UserPhoneRegistrationDto } from './dto/user-phone-registration.dto';
import { RequestPhoneRegistrationOtp } from './dto/request-phone-registration-otp.dto';
import { ForgetPasswordEmailTemplate } from '../common/email-templates/forget-password-email-template';

@Injectable()
export class UserEmailService {
  constructor(
    private readonly emailService: EmailService,
    private readonly hashingService: HashingService,
    private readonly helperService: HelperService,
    private readonly prismaService: PrismaService,
     private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
    private readonly otpService: OtpService,
    // private readonly cloudStorageService: CloudStorageService,
    // private readonly rewardService: RewardsService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const activeUserData: ActiveUserData = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.tokenAudience,
          issuer: this.jwtConfiguration.tokenIssuer,
        },
      );

      // TODO: Get the User
      const user = await this.prismaService.iamUser.findUnique({
        where: {
          id: activeUserData.sub,
        },
      });

      // TODO check if token is valid
      // const isValid = await this.refreshTokenIdsStorageService.validate(
      //   user.id,
      //   activeUserData.refreshTokenId,
      //   user.role,
      // );

      if (false) {
        // TODO
        // await this.refreshTokenIdsStorageService.invalidate(user.id, user.role);
      } else {
        throw new BadRequestException('Refresh token is invalid');
      }

      // generate new refresh and access token and send
      return this.generateTokens(activeUserData);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async logout(activeUserData: ActiveUserData) {
    // TODO: implementation <== setup rdis and blacklist the token

    return {
      message: 'Successfully logged out',
    };
  }

  async validateUsername(validateUsernameDto: ValidateUsernameDto) {

    const user = await this.prismaService.iamUser.findUnique({
      where: { username: validateUsernameDto.username },
    });

    return {
      message: 'Successful',
      data: user === null,
    };
  }

  async login(userLoginDto: UserLoginDto) {

    // check if user exists
    const user = await this.prismaService.iamUser.findFirst({
      where: {
        email: userLoginDto.email,
        role: 'user'
      },
    });

    // throw error if user does not exists
    if (!user) {
      throw new NotFoundException('User Does not Exist');
    }

    // check if user email is verified
    if (!user.emailVerified) {
      throw new NotAcceptableException({
        message:
          'User already exist, but has not verified their email. Please verify your email now',
        userId: user.id,
        email: user.email,
        field: 'EMAIL',
      });
    }

    // check if user is verified
    // if (!user.phoneVerified) {
    //   throw new NotAcceptableException({
    //     message:
    //       'User already exist, but has not verified their phone. Please verify your email now',
    //     userId: user.id,
    //     email: user.email,
    //     field: 'PHONE',
    //   });
    // }

    // compare and check if the passwords matches
    const isValidPassword = await this.hashingService.compare(
      userLoginDto.password,
      user.passwordHash ?? '',
    );

    // check if password matches
    if (!isValidPassword) {
      throw new BadRequestException('User Does not Exist');
    }

    // token payload
    const tokenPayload: ActiveUserData = {
      sub: user.id,
      email: user.email,
      role: Role.User,
    };

    // generate access and refresh token
    const [accessToken, refreshToken] = await this.generateTokens(tokenPayload);

    // TODO: To remove
    // update login token
    // await this.rewardService.updateEarnedTask(
    //   TaskConstant.dailyLogin,
    //   user.rewardId,
    // );

    // TODO: fetch the user via grpc
    return {
      message: 'User successfully logged in',
      data: {
        id: user.id,
        fullName: 'user.fullname',
        email: user.email,
        userName: 'user.username',
        pin: 'user.pin',
        androidShareLink: `http://www.playstore.com/sportboo/${user.username}`,
        iosShareLink: `http://www.playstore.com/sportboo/${user.username}`,
        sportbooId: 'user.sportbooId',
        phone: 'user.phone',
        profileImgUrl: 'user.profileImgUrl',
        // profileImgUrl: await this.cloudStorageService.getFileDownloadUrl(
        //   user.profileImgUrl,
        // ),
        deviceId: 'user.deviceId',
        accountStatus: user.accountStatus,
        unreadNotifications: 5,
        unreadMessages: 7,
        accessToken,
        refreshToken,
        residentialAddress: 'user.residentialAddress',
        preferences: 'user.preferences',
        externalCommunication: 'user.externalCommunication',
        inAppCommunication: 'user.inAppCommunication',
        securityPreferences: 'user.securityPreferences',
        walletActivities: 'user.walletActivities',
        securityAlerts: 'user.securityAlerts',
        createdAt: user.createdAt,
      },
    };
  }

  // async googleLogin(googleLoginDto: GoogleLoginDto) {
  //   // authenticate via google service
  //   const activeUserData = await this.googleAuthenticationService.authenticate(
  //     googleLoginDto.idToken,
  //   );

  //   // generate access and refresh token
  //   const [accessToken, refreshToken] =
  //     await this.generateTokens(activeUserData);

  //   // get the user
  //   const user = await this.prismaService.user.findFirst({
  //     where: {
  //       id: activeUserData.sub,
  //     },
  //     include: {
  //       residentialAddress: true,
  //       preferences: true,
  //       externalCommunication: true,
  //       inAppCommunication: true,
  //       securityPreferences: true,
  //       walletActivities: true,
  //       securityAlerts: true,
  //     },
  //   });

  //   // TODO: To remove
  //   // update login token
  //   await this.rewardService.updateEarnedTask(
  //     TaskConstant.dailyLogin,
  //     user.rewardId,
  //   );

  //   // TODO: add more user info stuffs to return
  //   return {
  //     message: 'User successfully logged in',
  //     data: {
  //       id: user.id,
  //       fullName: user.fullname,
  //       email: user.email,
  //       userName: user.username,
  //       pin: user.pin,
  //       androidShareLink: `http://www.playstore.com/sportboo/${user.username}`,
  //       iosShareLink: `http://www.playstore.com/sportboo/${user.username}`,
  //       sportbooId: user.sportbooId,
  //       phone: user.phone,
  //       profileImgUrl: await this.cloudStorageService.getFileUrl(
  //         user.profileImgUrl,
  //       ),
  //       deviceId: user.deviceId,
  //       accountStatus: user.accountStatus,
  //       unreadNotifications: 5,
  //       unreadMessages: 7,
  //       accessToken,
  //       refreshToken,
  //       residentialAddress: user.residentialAddress,
  //       preferences: user.preferences,
  //       externalCommunication: user.externalCommunication,
  //       inAppCommunication: user.inAppCommunication,
  //       securityPreferences: user.securityPreferences,
  //       walletActivities: user.walletActivities,
  //       securityAlerts: user.securityAlerts,
  //       createdAt: user.createdAt,
  //     },
  //   };
  // }

  async register(userRegistrationDto: UserRegistrationDto) {
    // check if email exist
    const foundUser = await this.prismaService.iamUser.findFirst({
      where: {
        email: userRegistrationDto.email,
      },
    });

    // if user exist and has not verify email
    if (foundUser && (!foundUser.emailVerified)) {
      throw new NotAcceptableException({
        message:
          'User already exist, but has not verified their email or phone. Please verify your email',
        userId: foundUser.id,
        email: foundUser.email,
        field: 'EMAIL',
      });
    }

    // if user exist and has verify email
    if (foundUser != null && foundUser.emailVerified) {
      throw new ConflictException('User already exist');
    }

    // check if username exist
    const foundUsername = await this.prismaService.iamUser.findFirst({
      where: {
        username: userRegistrationDto.username,
      },
    });

    // if username exist
    if (foundUsername != null) {
      throw new ConflictException('Username already exist');
    }

    // hash the password
    const hashedPassword = await this.hashingService.hash(
      userRegistrationDto.password,
    );

    // generate sportboo id
    const sportbooId = await this.helperService.generateSportbooUserId();

    // create iam
    const iamUser = await this.prismaService.iamUser.create({
      data: {
        username: userRegistrationDto.username,
        email: userRegistrationDto.email,
        passwordHash: hashedPassword,
        role: Role.User,
      }})

    // // create the user via grpc
    // const user = await this.prismaService.user.create({
    //   data: {
    //     fullname: userRegistrationDto.fullname,
    //     email: userRegistrationDto.email,
    //     password: hashedPassword,
    //     sportbooId,
    //     deviceId: userRegistrationDto.deviceToken,
    //     authMethod: AuthMethod.email,
    //     username: userRegistrationDto.username,
    //     accountDailyLimit: { create: {} },
    //     reward: { create: {} },
    //     depositLimit: { create: {} },
    //     residentialAddress: { create: {} },
    //     preferences: { create: {} },
    //     externalCommunication: { create: {} },
    //     inAppCommunication: { create: {} },
    //     securityPreferences: { create: {} },
    //     walletActivities: { create: {} },
    //     securityAlerts: { create: {} },
    //     betUpdates: { create: {} },
    //     bookieAlerts: { create: {} },
    //     productUpdates: { create: {} },
    //     accountVerification: { create: {} },
    //     wallet: { create: {} },
    //     p2pProfile: {
    //       create: {
    //         username: userRegistrationDto.username,
    //       },
    //     },
    //   },
    // });

    // generate email verification otp
    const otp = await this.otpService.generateEmailRegistrationOtp(iamUser.id);

    // instanciate the email template
    const emailTemplate = new UserRegistrationEmailTemplate(
      userRegistrationDto.fullname,
      otp,
      'Welcome to Sportboo',
    );

    // send email with the otp
    await this.emailService.sendEmail({
      to: userRegistrationDto.email,
      subject: emailTemplate.subject,
      htmlBody: emailTemplate.htmlBody,
      textBody: emailTemplate.textBody,
    });

    // TODO: To remove
    // give reward
    // await this.rewardService.updateEarnedTask(
    //   TaskConstant.dailyLogin,
    //   user.rewardId,
    // );

    // TODO: to add more fields
    // return the user
    return {
      message: 'User registration successful',
      data: {
        fullname: userRegistrationDto.fullname,
        userId: iamUser.id,
        email: userRegistrationDto.email,
        sportbooId: 'user.sportbooId',
      },
    };
  }

  async verifyEmail(verifyEmailOtpDto: VerifyEmailOtpDto): Promise<any> {
    // find that otp
    const otpDocument = await this.prismaService.otp.findFirst({
      where: {
        value: verifyEmailOtpDto.otp,
        type: OtpType.EmailRegistration,
        userId: verifyEmailOtpDto.userId,
      },
    });

    // confirm if document exist
    if (!otpDocument) {
      throw new BadRequestException('Invalid otp provided');
    }

    // confirms if the otp has expires
    if (otpDocument.expiresAt < new Date()) {
      // delete that otp
      await this.prismaService.otp.deleteMany({
        where: {
          type: OtpType.EmailRegistration,
          userId: verifyEmailOtpDto.userId,
        },
      });

      // throw an error
      throw new GoneException(
        'Otp has expired, please request for another one',
      );
    }

    // Delete the otp
    await this.prismaService.otp.deleteMany({
      where: {
        type: OtpType.EmailRegistration,
        userId: verifyEmailOtpDto.userId,
      },
    });

    // TODO: update user via grpc

    // update the user verification state
    const user = await this.prismaService.iamUser.update({
      where: {
        id: verifyEmailOtpDto.userId,
      },
      data: {
        emailVerified: true,
      },
    });

    // token payload
    const tokenPayload: ActiveUserData = {
      sub: user.id,
      email: user.email,
      role: Role.User,
    };

    // generate access and refresh token
    const [accessToken, refreshToken] = await this.generateTokens(tokenPayload);

    return {
      message: 'OTP Verification was successfull',
      data: {
        accessToken,
        refreshToken,
        userId: user.id,
      },
    };
  }

  async requestEmailRegistrationOtp(
    requestEmailRegistrationOtp: RequestEmailRegistrationOtp,
  ) {
    // get the user id from the body
    const user = await this.prismaService.iamUser.findFirst({
      where: {
        email: requestEmailRegistrationOtp.email,
      },
    });

    // check if user exists
    if (!user) {
      throw new NotFoundException('No user found');
    }

    // delete what ever otp that was there
    await this.prismaService.otp.deleteMany({
      where: {
        userId: user.id,
        type: OtpType.EmailRegistration,
      },
    });

    // generate a new otp
    const otp = await this.otpService.generateEmailRegistrationOtp(user.id);

    // instanciate the email template
    const emailTemplate = new RequestRegistrationEmailTemplate(
      'user.fullname',
      otp,
      'OTP Request',
    );

    // send email with the otp
    await this.emailService.sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      htmlBody: emailTemplate.htmlBody,
      textBody: emailTemplate.textBody,
    });

    return {
      message: `An email containing the otp has been sent to ${user.email}`,
      data: {
        userId: user.id,
        email: user.email,
      },
    };
  }

  async registerPhone(
    userPhoneRegistrationDto: UserPhoneRegistrationDto,
  ) {
    // get the current user
    const user = await this.prismaService.iamUser.findFirst({
      where: {
        id: userPhoneRegistrationDto.userId,
      },
    });

    // check if user exists
    if (!user) {
      throw new NotFoundException('No user found');
    }

    // check if phone number already exists
    // const foundUserPhone = await this.prismaService.user.findFirst({
    //   where: {
    //     phone: userPhoneRegistrationDto.phone,
    //   },
    // });

    // if (foundUserPhone && user.id != foundUserPhone.id) {
    //   throw new ConflictException(
    //     'Phone number already exist, please use another one',
    //   );
    // }

    // generate a new otp
    const otp = await this.otpService.generateUserPhoneRegistrationOtp(user.id);

    // TODO: send sms with the otp
    // await this.smsService.sendRegistrationVerificationSms(
    //   userPhoneRegistrationDto.phone,
    //   otp,
    // );

    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Sportboo OTP Request',
      textBody: `Yor phone otp is: ${otp}`,
      htmlBody: `Yor phone otp is: <b>${otp}</b>, make sure say you no show another person oh`,
    });

    // save the phone number
    await this.prismaService.iamUser.update({
      where: {
        id: user.id,
      },
      data: {
        // phone: userPhoneRegistrationDto.phone,
      },
    });

    // return a value
    return {
      message: 'An otp has been successfully sent to your number',
      userId: user.id,
    };
  }

  async verifyPhone(verifyOtpDto: VerifyEmailOtpDto) {
    // find that otp
    const otpDocument = await this.prismaService.otp.findFirst({
      where: {
        value: verifyOtpDto.otp,
        type: OtpType.PhoneRegistration,
        userId: verifyOtpDto.userId,
      },
    });

    // confirm if document exist
    if (!otpDocument) {
      throw new BadRequestException('Invalid otp provided');
    }

    // confirms if the otp has expires
    if (otpDocument.expiresAt < new Date()) {
      // delete that otp
      await this.prismaService.otp.deleteMany({
        where: {
          type: OtpType.PhoneRegistration,
          userId: verifyOtpDto.userId,
        },
      });

      // throw an error
      throw new GoneException(
        'Otp has expired, please request for another one',
      );
    }

    // verify the user phone
    // const user = await this.prismaService.user.update({
    //   where: {
    //     id: verifyOtpDto.userId,
    //   },
    //   data: {
    //     phoneVerified: true,
    //   },
    // });

    // Delete the token
    await this.prismaService.otp.deleteMany({
      where: {
        type: OtpType.PhoneRegistration,
        userId: verifyOtpDto.userId,
      },
    });

    // token payload
    // const tokenPayload: ActiveUserData = {
    //   sub: user.id,
    //   email: user.email,
    //   role: user.role,
    // };

    // // generate access and refresh token
    // const [accessToken, refreshToken] = await this.generateTokens(tokenPayload);

    // // upsert the user to chat
    // await this.helperService.upsertUserToChatApp({
    //   userId: user.id,
    //   username: user.username,
    //   profileImgUrl: user.profileImgUrl,
    //   deviceId: user.deviceId,
    // });

    // await this.helperService.upsertUserToLivescoreApp(
    //   {
    //     username: user.username,
    //     profileImgUrl: user.profileImgUrl,
    //     deviceId: user.deviceId,
    //     fullname: user.fullname,
    //     email: user.email,
    //     goat: user.goat,
    //     sportbooId: user.sportbooId,
    //     playerFavorites: user.playerFavorites,
    //     competitionFavorites: user.competitionFavorites,
    //     matchFavorites: user.matchFavorites,
    //     teamFavorites: user.teamFavorites,
    //   },
    //   user.id,
    // );

    return {
      message: 'Phone number was updated sucessfully',
      data: {
        userId: verifyOtpDto.userId,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      },
    };
  }

  async requestPhoneRegistrationOtp(
    requestPhoneRegistrationOtp: RequestPhoneRegistrationOtp,
  ) {
    // get the user id from the body
    const user = await this.prismaService.iamUser.findUnique({
      where: {
        email: requestPhoneRegistrationOtp.email,
      },
    });

    // check if user exists
    if (!user) {
      throw new NotFoundException('No user found');
    }

    // delete what ever otp that was there
    await this.prismaService.otp.deleteMany({
      where: {
        userId: user.id,
        type: OtpType.PhoneRegistration,
      },
    });

    // generate email verification otp
    const otp = await this.otpService.generateUserPhoneRegistrationOtp(user.id);

    // TODO: send sms with the otp
    // await this.smsService.sendRegistrationVerificationSms(
    //   requestPhoneRegistrationOtp.phone,
    //   otp,
    // );

    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Sportboo OTP Request',
      textBody: `Yor phone otp is: ${otp}`,
      htmlBody: `Yor phone otp is: <b>${otp}</b>, make sure say you no show another person oh`,
    });

    return {
      message: `an sms containing the otp has been sent to ${user.email}`,
      userId: user.id,
      otp: otp,
    };
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    // get the otp document and check if user has verified the password
    const otpRecord = await this.prismaService.otp.findFirst({
      where: {
        type: OtpType.ForgetUserPasswordOtp,
        userId: forgetPasswordDto.userId,
      },
    });

    if (!otpRecord) {
      throw new NotFoundException('No otp found');
    }

    // check if the otp is valid
    if (!otpRecord.verified) {
      throw new BadRequestException('Otp has not been verified');
    }

    // hash the password
    const hashedPassword = await this.hashingService.hash(
      forgetPasswordDto.password,
    );

    // update the user password
    const updatedUser = await this.prismaService.iamUser.update({
      where: {
        id: forgetPasswordDto.userId,
      },
      data: {
        passwordHash: hashedPassword,
      },
    });

    // Delete the token
    await this.prismaService.otp.deleteMany({
      where: {
        type: OtpType.ForgetUserPasswordOtp,
        userId: forgetPasswordDto.userId,
      },
    });

    return {
      message: 'Pasword reset successful, please proceed to login',
      data: {
        userId: updatedUser.id,
        email: updatedUser.email,
      },
    };
  }

  async forgetPasswordOtp(forgetPasswordOtpDto: ForgetPasswordOtpDto) {
    // check if both phone and email are null
    if (!forgetPasswordOtpDto.email && !forgetPasswordOtpDto.phone) {
      throw new BadRequestException(
        'You are to provide either an email or a phone number',
      );
    }

    // get the user
    let user: any;

    if (forgetPasswordOtpDto.email) {
      user = await this.prismaService.iamUser.findFirst({
        where: {
          email: forgetPasswordOtpDto.email,
        },
      });
    } else {
      user = await this.prismaService.iamUser.findFirst({
        // where: { phone: forgetPasswordOtpDto.phone },
      });
    }

    // if no user exist, throw an error
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // generate email verification otp
    const otp = await this.otpService.generateUserForgetPasswordOtp(user.id);

    // send the otp to phone or email
    if (forgetPasswordOtpDto.email) {
      // instanciate the email template
      const emailTemplate = new ForgetPasswordEmailTemplate(
        user.fullname,
        otp,
        'Reset Password',
      );

      // send email with the otp
      await this.emailService.sendEmail({
        to: user.email,
        subject: emailTemplate.subject,
        htmlBody: emailTemplate.htmlBody,
        textBody: emailTemplate.textBody,
      });
    } else {
      // send sms with the otp
      await this.smsService.sendRegistrationVerificationSms(user.phone, otp);
    }

    return {
      message: 'OTP successfully sent to you',
      data: {
        userId: user.id,
        email: user.email,
        phone: user.phone,
        otp: otp,
      },
    };
  }

  async forgetPasswordVerify(forgetPasswordVerifyDto: ForgetPasswordVerifyDto) {
    // check if the otp exist
    const otpDocument = await this.prismaService.otp.findFirst({
      where: {
        type: OtpType.ForgetUserPasswordOtp,
        value: forgetPasswordVerifyDto.otp,
        userId: forgetPasswordVerifyDto.userId,
      },
    });

    // check if the otp exists
    if (!otpDocument) {
      throw new BadRequestException('Invalid Otp provided');
    }

    // verify the otp
    if (otpDocument.expiresAt < new Date()) {
      await this.prismaService.otp.deleteMany({
        where: {
          type: OtpType.ForgetUserPasswordOtp,
          userId: forgetPasswordVerifyDto.userId,
        },
      });

      throw new BadRequestException('Otp has expired');
    }

    // Update the otp to verified true
    await this.prismaService.otp.updateMany({
      where: {
        type: OtpType.ForgetUserPasswordOtp,
        userId: forgetPasswordVerifyDto.userId,
      },
      data: {
        verified: true,
      },
    });

    // return the response
    return {
      message: 'OTP successfully verified',
      data: {
        userId: forgetPasswordVerifyDto.userId,
        otp: forgetPasswordVerifyDto.otp,
      },
    };
  }

  public async generateTokens(activeUserData: ActiveUserData) {
    const refreshTokenId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(activeUserData, AuthTokenType.Access),
      this.signToken(
        { ...activeUserData, refreshTokenId },
        AuthTokenType.Refresh,
      ),
    ]);

    // TODO:
    // await this.refreshTokenIdsStorageService.insert(
    //   activeUserData.sub,
    //   refreshTokenId,
    //   activeUserData.role,
    // );

    return [accessToken, refreshToken];
  }

  private async signToken(
    activeUserData: ActiveUserData,
    authTokenType: AuthTokenType,
  ) {
    // generate token
    const token = await this.jwtService.signAsync(activeUserData, {
      audience: this.jwtConfiguration.tokenAudience,
      issuer: this.jwtConfiguration.tokenIssuer,
      secret: this.jwtConfiguration.secret,
      expiresIn:
        authTokenType === AuthTokenType.Access
          ? this.jwtConfiguration.accessTokenTtl
          : this.jwtConfiguration.refreshTokenTtl,
    });

    return token;
  }
}
