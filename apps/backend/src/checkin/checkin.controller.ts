import { Controller, Get, Post } from '@nestjs/common';
import { CheckinService } from './checkin.service';

import { CurrentUserId } from 'src/common/decorator/user.decorator';

@Controller('checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post()
  async checkIn(@CurrentUserId() userId: string) {
    return this.checkinService.checkIn(userId);
  }

  @Get('history')
  async getCheckInHistory(@CurrentUserId() userId: string) {
    return this.checkinService.getCheckInHistory(userId);
  }

  @Get('status')
  async getCheckInStatus(@CurrentUserId() userId: string): Promise<any> {
    return this.checkinService.getCheckInStatus(userId);
  }
}
