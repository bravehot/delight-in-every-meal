import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';

import { UserService } from './user.service';

import { LoginRegisterDto, CaptchaDto, SmsDto, UserHealthDto } from './dto';
import { Public } from 'src/constants';
import { CurrentUserId } from 'src/common/decorator/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginRegisterDto) {
    return this.userService.login(body);
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
    res.type('svg').send(captcha.data);
  }

  @Get('profile')
  async getUserInfo(@CurrentUserId() userId: string) {
    return await this.userService.getUserInfo(userId);
  }

  @Post('health')
  async setUserHealth(
    @CurrentUserId() userId: string,
    @Body() body: UserHealthDto,
  ) {
    return await this.userService.setUserHealth(userId, body);
  }
}
