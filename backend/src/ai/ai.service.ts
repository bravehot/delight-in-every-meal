import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatZhipuAI } from '@langchain/community/chat_models/zhipuai';
import { HumanMessage } from '@langchain/core/messages';

@Injectable()
export class AiService {
  private model: ChatZhipuAI;

  constructor(private configService: ConfigService) {
    this.model = new ChatZhipuAI({
      model: 'glm-4',
      temperature: 0,
      zhipuAIApiKey: this.configService.get<string>('ZHIPUAI_API_KEY'),
    });
  }

  async chat(input: string) {
    try {
      const messages = [new HumanMessage(input)];
      const response = await this.model.invoke(messages);
      console.log('response: ', response);
      return response.content;
    } catch (error) {
      throw new Error(`AI Service Error: ${error.message}`);
    }
  }
}
