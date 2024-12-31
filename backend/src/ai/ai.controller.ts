import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { CurrentUserId } from '../common/decorator/user.decorator';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  async chat(
    @CurrentUserId() userId: string,
    @Body() { input }: { input: string },
  ) {
    return this.aiService.chat(userId, input);
  }

  @Post('analyze')
  async analyze(
    @CurrentUserId() userId: string,
    @Body() { imgUrl }: { imgUrl: string },
  ) {
    return this.aiService.analyze(userId, imgUrl);
  }

  @Post('history')
  async history(
    @CurrentUserId() userId: string,
    @Body() { page = 1, pageSize = 10 }: { page?: number; pageSize?: number },
  ) {
    return this.aiService.history(userId, page, pageSize);
  }
}
