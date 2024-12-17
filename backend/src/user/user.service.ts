import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

import { RedisService } from 'src/common/redis/redis.service';
import { SmsService } from 'src/common/sms/sms.service';
import { PrismaService } from 'src/common/prisma/prisma.service';

import { LoginRegisterDto, CaptchaDto, SmsDto } from './dto';
import { CacheEnum } from 'src/types/enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getAccessRefreshToken } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    private readonly redisService: RedisService,
    private readonly smsService: SmsService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(info: LoginRegisterDto) {
    const { phoneNum, smsCode } = info;
    const redisSmsCode = await this.redisService.get(
      `${CacheEnum.LOGIN_SMS_CODE_KEY}${phoneNum}`,
    );

    if (!redisSmsCode) {
      throw new HttpException('验证码已过期', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (redisSmsCode !== smsCode) {
      throw new HttpException('验证码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        phoneNum,
      },
    });

    if (!user) {
      const newUser = await this.prismaService.user.create({
        data: {
          phoneNum,
        },
      });

      return newUser;
    }

    const signPayload = {
      userId: user.id,
      phoneNum: user.phoneNum,
    };

    const tokenInfo = await getAccessRefreshToken(
      this.jwtService,
      signPayload,
      this.configService.get('ACCRESS_TOKEN_EXPIRES') || '7d',
      this.configService.get('REFRESH_TOKEN_EXPIRES') || '14d',
    );

    return {
      ...user,
      ...tokenInfo,
    };
  }

  async getSmsCode(info: SmsDto) {
    const { phoneNum, captcha } = info;
    const redisCaptcha = await this.redisService.get(
      `${CacheEnum.CAPTCHA_SMS_CODE_KEY}${phoneNum}`,
    );

    if (!redisCaptcha) {
      throw new HttpException('验证码已过期', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (redisCaptcha?.toLowerCase() !== captcha.toLowerCase()) {
      throw new HttpException('验证码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.redisService.del(`${CacheEnum.CAPTCHA_SMS_CODE_KEY}${phoneNum}`);

    const randomCode = await this.smsService.sendSmsCode();

    await this.redisService.set(
      `${CacheEnum.LOGIN_SMS_CODE_KEY}${phoneNum}`,
      randomCode,
      60,
    );

    return randomCode;
  }

  async getCaptcha(info: CaptchaDto) {
    const { phoneNum } = info;
    const captcha = svgCaptcha.create();
    await this.redisService.set(
      `${CacheEnum.CAPTCHA_SMS_CODE_KEY}${phoneNum}`,
      captcha.text,
      60,
    );
    return captcha;
  }

  async getUserInfo(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.FORBIDDEN);
    }

    return user;
  }
}
