import {
  BadRequestException,
  ConflictException,
  GoneException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from '../common/services/hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { HelperService } from '../common/services/helper/helper.service';
import { PrismaService } from '../common/services/prisma/prisma.service';
import jwtConfig from '../common/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ActiveUserData } from '@app/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from '@nestjs/cache-manager';
import { GenericEnumMapper } from '@app/common/helper';
import { ValidateUsernameDto } from './dto/validate-username.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { AuthMethod, Role } from 'apps/iam-service/generated/prisma/enums';
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto';
import { RequestEmailRegistrationOtp } from './dto/request-email-registration-otp.dto';
import { UserPhoneRegistrationDto } from './dto/user-phone-registration.dto';
import { RequestPhoneRegistrationOtp } from './dto/request-phone-registration-otp.dto';
import { ForgetPasswordDto, OtpTransporter } from './dto/forget-password.dto';
import { ForgetPasswordOtpDto } from './dto/forget-password-otp.dto';
import { ForgetPasswordVerifyDto } from './dto/forget-password-verify.dto';

@Injectable()
export class UserEmailAuthService {
  constructor(
    // notification service for email, sms, filestorage

    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly helperService: HelperService,
    private readonly prismaService: PrismaService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      // verify the refresh token
      const activeUser = await this.helperService.verifyRefreshToken(
        refreshTokenDto.refreshToken,
      );

      // get the user
      const user = await this.prismaService.user.findUnique({
        where: {
          id: activeUser.sub,
        },
      });

      // get stored refresh token from db
      const refreshTokenId = await this.cacheManager.get(
        this.helperService.getRefreshTokenCacheKey(
          activeUser.sub,
          activeUser.role,
        ),
      );

      // validate refresh token token
      const isValid = refreshTokenId === activeUser.refreshTokenId;

      // check
      if (!isValid) {
        throw new BadRequestException();
      }

      // remove the refresh token
      await this.cacheManager.del(
        this.helperService.getRefreshTokenCacheKey(
          activeUser.sub,
          activeUser.role,
        ),
      );

      // token payload
      const tokenPayload: ActiveUserData = {
        sub: Number(user.id),
        email: user.email,
        role: GenericEnumMapper.map(
          user.role,
          this.helperService.ROLE_TO_DOMAIN,
        ),
      };

      // generate access and refresh token
      const { accessToken, refreshToken } =
        await this.helperService.generateJwtTokens(tokenPayload);

      // TODO: add more user info stuffs to return
      return {
        message: 'User successfully logged in',
        data: {
          id: user.id,
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async logout(refreshTokenDto: RefreshTokenDto) {
    // invalidte token
    try {
      // verify the refresh token
      const activeUser = await this.helperService.verifyRefreshToken(
        refreshTokenDto.refreshToken,
      );

      // get stored refresh token from db
      const refreshTokenId = await this.cacheManager.get(
        this.helperService.getRefreshTokenCacheKey(
          activeUser.sub,
          activeUser.role,
        ),
      );

      // validate refresh token token
      const isValid = refreshTokenId === activeUser.refreshTokenId;

      // check
      if (!isValid) {
        throw new UnauthorizedException();
      }

      // remove the refresh token
      await this.cacheManager.del(
        this.helperService.getRefreshTokenCacheKey(
          activeUser.sub,
          activeUser.role,
        ),
      );

      return {
        message: 'Successful',
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async validateUsername(validateUsernameDto: ValidateUsernameDto) {
    const user = await this.prismaService.user.findUnique({
      where: { username: validateUsernameDto.username },
    });

    return {
      message: 'Successful',
      data: user === null,
    };
  }

  async login(userLoginDto: UserLoginDto) {
    // check if user exists
    const user = await this.prismaService.user.findFirst({
      where: {
        email: userLoginDto.email,
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
    if (!user.phoneVerified) {
      throw new NotAcceptableException({
        message:
          'User already exist, but has not verified their phone. Please verify your email now',
        userId: user.id,
        email: user.email,
        field: 'PHONE',
      });
    }

    // compare and check if the passwords matches
    const isValidPassword = await this.hashingService.compare(
      userLoginDto.password,
      user.password,
    );

    // check if password matches
    if (!isValidPassword) {
      throw new BadRequestException('User Does not Exist');
    }

    // token payload
    const tokenPayload: ActiveUserData = {
      sub: Number(user.id),
      email: user.email,
      role: GenericEnumMapper.map(user.role, this.helperService.ROLE_TO_DOMAIN),
    };

    // generate access and refresh token
    const { accessToken, refreshToken } =
      await this.helperService.generateJwtTokens(tokenPayload);

    // TODO: update login rewords

    // TODO: add more user info stuffs to return
    return {
      message: 'User successfully logged in',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        accessToken,
        refreshToken,
      },
    };
  }

  async register(userRegistrationDto: UserRegistrationDto) {
    // check if email exist
    const foundUser = await this.prismaService.user.findFirst({
      where: {
        email: userRegistrationDto.email,
      },
    });

    // if user exist and has not verify email
    if (foundUser && (!foundUser.emailVerified || !foundUser.phone)) {
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
    const foundUsername = await this.prismaService.user.findFirst({
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

    // create the iam user
    const user = await this.prismaService.user.create({
      data: {
        fullname: userRegistrationDto.fullname,
        email: userRegistrationDto.email,
        password: hashedPassword,
        sportbooId,
        authMethod: AuthMethod.email,
        role: Role.user,
        username: userRegistrationDto.username,
      },
    });

    // TODO: Create the user in user service
    // TODO: Create the user Wallet

    // generate email verification otp
    const otp = await this.helperService.generateOtp();

    // TODO: send email with the otp

    // TODO: Give the user registration reword

    // return the user
    return {
      message: 'User registration successful',
      data: {
        fullname: user.fullname,
        userId: user.id,
        email: user.email,
        sportbooId: user.sportbooId,
        otp: otp,
      },
    };
  }

  async verifyEmail(verifyEmailOtpDto: VerifyEmailOtpDto): Promise<any> {
    // find that otp
    const otpDocument = await this.prismaService.emailVerificationOtp.findFirst(
      {
        where: {
          otp: verifyEmailOtpDto.otp,
          userId: verifyEmailOtpDto.userId,
        },
      },
    );

    // confirm if document exist
    if (!otpDocument) {
      throw new BadRequestException('Invalid otp provided');
    }

    // confirms if the otp has expires
    if (otpDocument.expiresAt < new Date()) {
      // delete that otp
      await this.prismaService.emailVerificationOtp.deleteMany({
        where: {
          otp: verifyEmailOtpDto.otp,
          userId: verifyEmailOtpDto.userId,
        },
      });

      // throw an error
      throw new GoneException(
        'Otp has expired, please request for another one',
      );
    }

    // Delete the otp
    await this.prismaService.emailVerificationOtp.deleteMany({
      where: {
        otp: verifyEmailOtpDto.otp,
        userId: verifyEmailOtpDto.userId,
      },
    });

    // update the user verification state
    const user = await this.prismaService.user.update({
      where: {
        id: verifyEmailOtpDto.userId,
      },
      data: {
        emailVerified: true,
      },
    });

    // token payload
    const tokenPayload: ActiveUserData = {
      sub: Number(user.id),
      email: user.email,
      role: GenericEnumMapper.map(user.role, this.helperService.ROLE_TO_DOMAIN),
    };

    // generate access and refresh token
    const { accessToken, refreshToken } =
      await this.helperService.generateJwtTokens(tokenPayload);

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
    const user = await this.prismaService.user.findFirst({
      where: {
        email: requestEmailRegistrationOtp.email,
      },
    });

    // check if user exists
    if (!user) {
      throw new NotFoundException('No user found');
    }

    // delete what ever otp that was there for this user
    await this.prismaService.emailVerificationOtp.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // generate a new otp
    const otp = await this.helperService.generateOtp();

    // TODO: send email with the otp

    return {
      message: `An email containing the otp has been sent to ${user.email}`,
      data: {
        userId: user.id,
        email: user.email,
        otp: otp,
      },
    };
  }

  async registerPhone(userPhoneRegistrationDto: UserPhoneRegistrationDto) {
    // get the current user
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userPhoneRegistrationDto.userId,
      },
    });

    // check if user exists
    if (!user) {
      throw new NotFoundException('No user found');
    }

    // check if phone number already exists
    const foundUserPhone = await this.prismaService.user.findFirst({
      where: {
        phone: userPhoneRegistrationDto.phone,
      },
    });

    if (foundUserPhone && user.id != foundUserPhone.id) {
      throw new ConflictException(
        'Phone number already exist, please use another one',
      );
    }

    // generate a new otp
    const otp = await this.helperService.generateOtp();

    // TODO: send sms with the otp

    // save the phone number
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        phone: userPhoneRegistrationDto.phone,
      },
    });

    // TODO: also save it in user service

    // return a value
    return {
      message: 'An otp has been successfully sent to your number',
      userId: user.id,
      otp,
    };
  }

  async verifyPhone(verifyOtpDto: VerifyEmailOtpDto) {
    // find that otp
    const otpDocument = await this.prismaService.phoneVerificationOtp.findFirst(
      {
        where: {
          otp: verifyOtpDto.otp,
          userId: verifyOtpDto.userId,
        },
      },
    );

    // confirm if document exist
    if (!otpDocument) {
      throw new BadRequestException('Invalid otp provided');
    }

    // confirms if the otp has expires
    if (otpDocument.expiresAt < new Date()) {
      // delete that otp
      await this.prismaService.phoneVerificationOtp.deleteMany({
        where: {
          userId: verifyOtpDto.userId,
        },
      });

      // throw an error
      throw new GoneException(
        'Otp has expired, please request for another one',
      );
    }

    // verify the user phone
    const user = await this.prismaService.user.update({
      where: {
        id: verifyOtpDto.userId,
      },
      data: {
        phoneVerified: true,
      },
    });

    // Delete the token
    await this.prismaService.phoneVerificationOtp.deleteMany({
      where: {
        userId: verifyOtpDto.userId,
      },
    });

    // token payload
    const tokenPayload: ActiveUserData = {
      sub: Number(user.id),
      email: user.email,
      role: GenericEnumMapper.map(user.role, this.helperService.ROLE_TO_DOMAIN),
    };

    // generate access and refresh token
    const { accessToken, refreshToken } =
      await this.helperService.generateJwtTokens(tokenPayload);

    // Todo: emit update user events, to all services that uses user

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
        accessToken,
        refreshToken,
      },
    };
  }

  async requestPhoneRegistrationOtp(
    requestPhoneRegistrationOtp: RequestPhoneRegistrationOtp,
  ) {
    // get the user id from the body
    const user = await this.prismaService.user.findUnique({
      where: {
        email_role: {
          email: requestPhoneRegistrationOtp.email,
          role: 'user',
        },
      },
    });

    // check if user exists
    if (!user) {
      throw new NotFoundException('No user found');
    }

    // delete what ever otp that was there
    await this.prismaService.phoneVerificationOtp.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // generate email verification otp
    const otp = await this.helperService.generateOtp();

    // TODO: send sms with the otp

    return {
      message: `an sms containing the otp has been sent to ${user.email}`,
      userId: user.id,
      otp: otp,
    };
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    // get the otp document and check if user has verified the password
    const otpRecord =
      forgetPasswordDto.otpTransporter === OtpTransporter.Email
        ? await this.prismaService.emailVerificationOtp.findFirst({
            where: {
              userId: forgetPasswordDto.userId,
            },
          })
        : await this.prismaService.phoneVerificationOtp.findFirst({
            where: {
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
    const updatedUser = await this.prismaService.user.update({
      where: {
        id: forgetPasswordDto.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    // Delete the token
    await this.prismaService.emailVerificationOtp.deleteMany({
      where: {
        userId: forgetPasswordDto.userId,
      },
    });
    await this.prismaService.phoneVerificationOtp.deleteMany({
      where: {
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
      user = await this.prismaService.user.findFirst({
        where: {
          email: forgetPasswordOtpDto.email,
        },
      });
    } else {
      user = await this.prismaService.user.findFirst({
        where: { phone: forgetPasswordOtpDto.phone },
      });
    }

    // if no user exist, throw an error
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // generate email verification otp
    const otp = this.helperService.generateOtp();

    // send the otp to phone or email
    if (forgetPasswordOtpDto.email) {
      // TODO: send email with the otp
    } else {
      // TODO: send sms with the otp
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
    const otpDocument =
      forgetPasswordVerifyDto.otpTransporter === OtpTransporter.Email
        ? await this.prismaService.emailVerificationOtp.findFirst({
            where: {
              otp: forgetPasswordVerifyDto.otp,
              userId: forgetPasswordVerifyDto.userId,
            },
          })
        : await this.prismaService.phoneVerificationOtp.findFirst({
            where: {
              otp: forgetPasswordVerifyDto.otp,
              userId: forgetPasswordVerifyDto.userId,
            },
          });

    // check if the otp exists
    if (!otpDocument) {
      throw new BadRequestException('Invalid Otp provided');
    }

    // verify the otp
    if (otpDocument.expiresAt < new Date()) {
      await this.prismaService.emailVerificationOtp.deleteMany({
        where: {
          userId: forgetPasswordVerifyDto.userId,
        },
      });
      await this.prismaService.phoneVerificationOtp.deleteMany({
        where: {
          userId: forgetPasswordVerifyDto.userId,
        },
      });

      throw new BadRequestException('Otp has expired');
    }

    // Update the otp to verified true
    if (forgetPasswordVerifyDto.otpTransporter === OtpTransporter.Email) {
      await this.prismaService.emailVerificationOtp.update({
        where: {
          id: otpDocument.id,
        },
        data: {
          verified: true,
        },
      });
    } else {
      await this.prismaService.phoneVerificationOtp.update({
        where: {
          id: otpDocument.id,
        },
        data: {
          verified: true,
        },
      });
    }

    // return the response
    return {
      message: 'OTP successfully verified',
      data: {
        userId: forgetPasswordVerifyDto.userId,
        otp: forgetPasswordVerifyDto.otp,
      },
    };
  }
}
