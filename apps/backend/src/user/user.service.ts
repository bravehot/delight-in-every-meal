import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { $Enums } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { SHA256 } from 'crypto-js';

import { RedisService } from 'src/common/redis/redis.service';
import { SmsService } from 'src/common/sms/sms.service';
import { PrismaService } from 'src/common/prisma/prisma.service';

import { getAccessRefreshToken } from 'src/utils';
import { DEFAULT_POINT_COUNT, DEFAULT_TOKEN_COUNT } from 'src/constants';

import {
  LoginDto,
  CaptchaDto,
  SmsDto,
  UserHealthDto,
  ActivityLevelFactors,
  Gender,
  RegisterDto,
  LoginByPasswordDto,
  ForgetPasswordDto,
  ChangePasswordDto,
} from './dto';
import { SmsCodeType } from 'src/types/enum';

import {
  IForgetPasswordRes,
  ILoginByPasswordRes,
  ILoginRes,
  IRegisterRes,
  IChangePasswordRes,
  IGetSmsCodeRes,
  IGetCaptchaRes,
  IUserInfoRes,
  IUserHealthRes,
} from '@repo/api-interface';

@Injectable()
export class UserService {
  constructor(
    private readonly redisService: RedisService,
    private readonly smsService: SmsService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async login(info: LoginDto): Promise<ILoginRes> {
    const { phoneNum, smsCode } = info;
    const redisSmsCode = await this.redisService.get(
      `${SmsCodeType.LOGIN_CODE_KEY}_sms_${phoneNum}`,
    );

    if (!redisSmsCode) {
      throw new HttpException('验证码已过期', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (redisSmsCode !== smsCode) {
      throw new HttpException('验证码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.redisService.del(
      `${SmsCodeType.LOGIN_CODE_KEY}_sms_${phoneNum}`,
    );

    const user = await this.prismaService.user.findUnique({
      where: {
        phoneNum,
      },
      select: {
        id: true,
        phoneNum: true,
        name: true,
        avatar: true,
        gender: true,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.INTERNAL_SERVER_ERROR);
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

    if (!tokenInfo) {
      throw new HttpException('登录失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      ...user,
      ...tokenInfo,
    };
  }

  async register(info: RegisterDto): Promise<IRegisterRes> {
    const { phoneNum, smsCode, password } = info;

    const redisSmsCode = await this.redisService.get(
      `${SmsCodeType.REGISTER_CODE_KEY}_sms_${phoneNum}`,
    );

    if (!redisSmsCode) {
      throw new HttpException('验证码已过期', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (redisSmsCode !== smsCode) {
      throw new HttpException('验证码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.redisService.del(
      `${SmsCodeType.REGISTER_CODE_KEY}_sms_${phoneNum}`,
    );

    const user = await this.prismaService.user.findUnique({
      where: {
        phoneNum,
      },
    });

    if (user) {
      throw new HttpException('用户已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      await this.prismaService.user.create({
        data: {
          password: SHA256(password).toString(),
          phoneNum,
          points: {
            create: {
              points: DEFAULT_POINT_COUNT,
            },
          },
          userToken: {
            create: {
              amount: DEFAULT_TOKEN_COUNT,
            },
          },
        },
      });
      return '注册成功';
    } catch (error) {
      throw new HttpException('注册失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async loginByPassword(
    info: LoginByPasswordDto,
  ): Promise<ILoginByPasswordRes> {
    const { phoneNum, password } = info;

    const user = await this.prismaService.user.findUnique({
      where: {
        phoneNum,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (user.password !== SHA256(password).toString()) {
      throw new HttpException('密码错误', HttpStatus.INTERNAL_SERVER_ERROR);
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
      id: user.id,
      phoneNum: user.phoneNum,
      name: user.name,
      avatar: user.avatar,
      gender: user.gender,
      ...tokenInfo,
    };
  }

  async forgetPassword(info: ForgetPasswordDto): Promise<IForgetPasswordRes> {
    const { phoneNum, smsCode, password } = info;

    const redisSmsCode = await this.redisService.get(
      `${SmsCodeType.FORGET_PASSWORD_CODE_KEY}_sms_${phoneNum}`,
    );

    if (!redisSmsCode) {
      throw new HttpException('验证码已过期', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (redisSmsCode !== smsCode) {
      throw new HttpException('验证码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.redisService.del(
      `${SmsCodeType.FORGET_PASSWORD_CODE_KEY}_sms_${phoneNum}`,
    );

    const user = await this.prismaService.user.findUnique({
      where: {
        phoneNum,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: SHA256(password).toString(),
        },
      });
      return '修改密码成功';
    } catch (error) {
      throw new HttpException('修改密码失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changePassword(
    userId: string,
    info: ChangePasswordDto,
  ): Promise<IChangePasswordRes> {
    const { phoneNum, smsCode, password, newPassword } = info;
    const redisSmsCode = await this.redisService.get(
      `${SmsCodeType.CHANGE_PASSWORD_CODE_KEY}_sms_${phoneNum}`,
    );

    if (!redisSmsCode) {
      throw new HttpException('验证码已过期', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (redisSmsCode !== smsCode) {
      throw new HttpException('验证码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (user.password !== SHA256(password).toString()) {
      throw new HttpException('旧密码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (user.password === SHA256(newPassword).toString()) {
      throw new HttpException('新密码不能与旧密码相同', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          password: SHA256(newPassword).toString(),
        },
      });

      await this.redisService.del(
        `${SmsCodeType.CHANGE_PASSWORD_CODE_KEY}_sms_${phoneNum}`,
      );

      return '修改密码成功';
    } catch (error) {
      throw new HttpException('修改密码失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSmsCode(info: SmsDto): Promise<IGetSmsCodeRes> {
    const { phoneNum, captcha, type } = info;

    const redisCaptcha = await this.redisService.get(
      `${type}_captcha_${phoneNum}`,
    );

    if (!redisCaptcha) {
      throw new HttpException('验证码已过期', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (redisCaptcha?.toLowerCase() !== captcha.toLowerCase()) {
      throw new HttpException('验证码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const randomCode = await this.smsService.sendSmsCode();
    await this.redisService.del(`${type}_captcha_${phoneNum}`);
    await this.redisService.set(`${type}_sms_${phoneNum}`, randomCode, 60);

    return randomCode;
  }

  async getCaptcha(info: CaptchaDto): Promise<IGetCaptchaRes> {
    const { phoneNum, type } = info;
    const captcha = svgCaptcha.create();
    await this.redisService.set(
      `${type}_captcha_${phoneNum}`,
      captcha.text,
      60,
    );
    return captcha.data;
  }

  async getUserInfo(userId: string): Promise<IUserInfoRes> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        phoneNum: true,
        name: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.FORBIDDEN);
    }

    return user;
  }

  async setUserHealth(
    userId: string,
    info: UserHealthDto,
  ): Promise<IUserHealthRes> {
    const { height, weight, gender, age, activityLevel } = info;

    const bmrValue =
      gender === Gender.MALE
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const tdeeValue = (bmrValue * ActivityLevelFactors[activityLevel]).toFixed(
      2,
    );

    const updatedHealth = await this.prismaService.userHealth.upsert({
      where: {
        userId,
      },
      create: {
        height,
        weight,
        age,
        gender,
        tdee: parseFloat(tdeeValue),
        activityLevel: activityLevel as unknown as $Enums.ActivityLevel,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      update: {
        height,
        weight,
        age,
        gender,
        tdee: parseFloat(tdeeValue),
        activityLevel: activityLevel as unknown as $Enums.ActivityLevel,
      },
    });

    return updatedHealth as unknown as IUserHealthRes;
  }

  async getUserHealth(userId: string): Promise<IUserHealthRes> {
    const userHealth = await this.prismaService.userHealth.findUnique({
      where: {
        userId,
      },
    });

    if (!userHealth) {
      throw new HttpException(
        '请填写健康信息',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return userHealth as unknown as IUserHealthRes;
  }
}
