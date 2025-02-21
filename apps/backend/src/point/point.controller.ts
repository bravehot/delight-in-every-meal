import { Controller, Get } from '@nestjs/common';
import { PointService } from './point.service';
import { CurrentUserId } from 'src/common/decorator/user.decorator';

@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get('getPoint')
  async getPoint(@CurrentUserId() userId: string) {
    return this.pointService.getPoint(userId);
  }
}
