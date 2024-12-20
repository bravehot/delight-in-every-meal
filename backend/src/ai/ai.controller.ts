import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  async chat(@Body() { input }: { input: string }) {
    console.log('input: ', input);
    return this.aiService.chat(input);
  }
}
