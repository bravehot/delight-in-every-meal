import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';

import { UserService } from './user.service';

import {
  LoginDto,
  CaptchaDto,
  SmsDto,
  UserHealthDto,
  RegisterDto,
  LoginByPasswordDto,
  ForgetPasswordDto,
  ChangePasswordDto,
} from './dto';
import { Public } from 'src/constants';
import { CurrentUserId } from 'src/common/decorator/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }

  @Public()
  @Post('loginByPassword')
  async loginByPassword(@Body() body: LoginByPasswordDto) {
    return this.userService.loginByPassword(body);
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.userService.register(body);
  }

  @Public()
  @Post('forgetPassword')
  async forgetPassword(@Body() body: ForgetPasswordDto) {
    return this.userService.forgetPassword(body);
  }

  @Public()
  @Post('changePassword')
  async changePassword(
    @CurrentUserId() userId: string,
    @Body() body: ChangePasswordDto,
  ) {
    return this.userService.changePassword(userId, body);
  }

  @Public()
  @Get('sendSms')
  async getSmsCode(@Query() info: SmsDto) {
    return this.userService.getSmsCode(info);
  }

  @Public()
  @Get('getCaptcha')
  async getCaptcha(@Res() res: Response, @Query() info: CaptchaDto) {
    const captcha = await this.userService.getCaptcha(info);
    res.type('svg').send(captcha);
  }

  @Get('profile')
  async getUserInfo(@CurrentUserId() userId: string) {
    return await this.userService.getUserInfo(userId);
  }

  @Post('setUserHealth')
  async setUserHealth(
    @CurrentUserId() userId: string,
    @Body() body: UserHealthDto,
  ) {
    return await this.userService.setUserHealth(userId, body);
  }

  @Get('getUserHealth')
  async getUserHealth(@CurrentUserId() userId: string) {
    return await this.userService.getUserHealth(userId);
  }
}
