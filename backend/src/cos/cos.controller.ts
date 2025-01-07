import { Controller, Get } from '@nestjs/common';
import { CosService } from './cos.service';
import { CurrentUserId } from 'src/common/decorator/user.decorator';

@Controller('cos')
export class CosController {
  constructor(private readonly cosService: CosService) {}

  @Get('sts')
  async getSTSConfig(@CurrentUserId() userId: string) {
    return this.cosService.getSTSConfig(userId);
  }
}
