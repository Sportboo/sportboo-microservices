import AuthTokenType from '@app/common/enums/auth-token-type.enum';
import { ActiveUserData } from '@app/common/interfaces/active-user-data.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { Role as PrismaRole } from 'apps/iam-service/generated/prisma/enums';
import Role from '@app/common/enums/role.enum';
import { GenericEnumMapper } from '@app/common/helper';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HelperService {
  private readonly logger = new Logger(HelperService.name);

  private charPool = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';

  public readonly ROLE_TO_DOMAIN: Record<PrismaRole, Role> = {
    [PrismaRole.super]: Role.Super,
    [PrismaRole.admin]: Role.Admin,
    [PrismaRole.user]: Role.User,
  };

  public readonly DOMAIN_TO_ROLE: Record<Role, PrismaRole> = {
    [Role.Super]: PrismaRole.super,
    [Role.Admin]: PrismaRole.admin,
    [Role.User]: PrismaRole.user,
  };

  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly prismaService: PrismaService,
  ) {}

  public generateStringDate(date: Date = new Date()): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
  }

  public generateRandomFileName(): string {
    return Date.now().toString() + '.' + this.generateUniqueString();
  }

  public async generateJwtTokens(activeUserData: ActiveUserData) {
    const refreshTokenId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.signJwtToken(activeUserData, AuthTokenType.Access),
      this.signJwtToken(
        { ...activeUserData, refreshTokenId },
        AuthTokenType.Refresh,
      ),
    ]);

    await this.cacheManager.set(
      this.getRefreshTokenCacheKey(activeUserData.sub, activeUserData.role),
      refreshTokenId,
      2_592_000,
    );

    return { accessToken, refreshToken };
  }

  public generateUniqueString(
    prefix: string = '',
    suffix: string = '',
    length: number = 10,
  ): string {
    let randomString = '';

    while (randomString.length < length) {
      const randomIndex = Math.floor(
        randomBytes(1).readUInt8() % this.charPool.length,
      );
      randomString += this.charPool.charAt(randomIndex);
    }

    return prefix + randomString + suffix;
  }

  public async verifyRefreshToken(token: string): Promise<ActiveUserData> {
    const payload = await this.jwtService.verifyAsync<ActiveUserData>(token, {
      secret: this.jwtConfiguration.refreshSecret,
      audience: this.jwtConfiguration.tokenAudience,
      issuer: this.jwtConfiguration.tokenIssuer,
    });

    return payload;
  }

  async generateSportbooUserId(): Promise<string> {
    let randomString: string;
    let existingDixaCarePatient: any;

    do {
      randomString = '';

      while (randomString.length < 11) {
        const randomIndex = Math.floor(
          randomBytes(1).readUInt8() % this.charPool.length,
        );
        randomString += this.charPool.charAt(randomIndex);
      }

      // Check for existing ID using Prisma
      try {
        existingDixaCarePatient = await this.prismaService.user.findFirst({
          where: { sportbooId: 'SB-' + randomString },
        });
      } catch (error) {
        // Handle potential Prisma errors gracefully (optional)
        this.logger.error(error);
        throw error;
      }
    } while (existingDixaCarePatient);

    return 'SB-' + randomString;
  }

  public generateOtp(): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 4; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  public getRefreshTokenCacheKey = (id: number, role: string) =>
    `${role}_REFRESH_TOKEN_${id}`;

  private async signJwtToken(
    activeUserData: ActiveUserData,
    authTokenType: AuthTokenType,
  ) {
    // generate token
    const token = await this.jwtService.signAsync(activeUserData, {
      audience: this.jwtConfiguration.tokenAudience,
      issuer: this.jwtConfiguration.tokenIssuer,
      secret:
        authTokenType === AuthTokenType.Access
          ? this.jwtConfiguration.secret
          : this.jwtConfiguration.refreshSecret,
      expiresIn:
        authTokenType === AuthTokenType.Access
          ? this.jwtConfiguration.accessTokenTtl
          : this.jwtConfiguration.refreshTokenTtl,
    });

    return token;
  }
}
