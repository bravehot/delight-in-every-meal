import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatZhipuAI } from '@langchain/community/chat_models/zhipuai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import {
  StringOutputParser,
  StructuredOutputParser,
} from '@langchain/core/output_parsers';
import { PrismaService } from '../common/prisma/prisma.service';

import { getSystemPrompt } from './prompt';
import { FoodAnalysisSchema } from './schema';
import { DEFAULT_COSUMER_COUNT } from 'src/constants';

@Injectable()
export class AiService {
  private model: ChatZhipuAI;
  private parser: StructuredOutputParser<typeof FoodAnalysisSchema>;

  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    this.model = new ChatZhipuAI({
      model: 'glm-4v-flash',
      temperature: 0.1,
      zhipuAIApiKey: this.configService.get<string>('ZHIPUAI_API_KEY'),
    });
    this.parser = StructuredOutputParser.fromZodSchema(FoodAnalysisSchema);
  }

  async chat(userId: string, input: string) {
    try {
      const messages = [new HumanMessage(input)];
      const outputPrase = new StringOutputParser();
      const simpleChain = this.model.pipe(outputPrase);

      const response = await simpleChain.invoke(messages);

      return response;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`AI Service Error: ${error.message}`);
    }
  }

  async analyze(userId: string, imgUrl: string) {
    await this.checkToken(userId);

    const formatInstructions = this.parser.getFormatInstructions();

    try {
      const response = await this.model.invoke([
        new SystemMessage(getSystemPrompt(formatInstructions)),
        new HumanMessage({
          content: [
            {
              type: 'text',
              text: '请分析这张图片中的食物，提供详细的营养信息，包括整体菜品名称和每个食物的信息。',
            },
            {
              type: 'image_url',
              image_url: {
                url: imgUrl,
              },
            },
          ],
        }),
      ]);
      const parsedOutput = await this.parser.parse(response.content.toString());
      const totalTokens =
        response.response_metadata?.tokenUsage?.totalTokens ||
        DEFAULT_COSUMER_COUNT;

      await this.consumeToken(userId, totalTokens);
      await this.saveRecord(
        userId,
        totalTokens,
        imgUrl,
        parsedOutput.foods,
        'CONSUME',
      );

      return parsedOutput.foods;
    } catch (error) {
      throw new HttpException('AI 分析失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async history(userId: string, page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [records, total] = await Promise.all([
      this.prismaService.tokenUsageRecord.findMany({
        where: {
          userToken: {
            userId,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: Number(pageSize),
        select: {
          id: true,
          amount: true,
          type: true,
          createdAt: true,
          imgUrl: true,
          result: true,
        },
      }),

      this.prismaService.tokenUsageRecord.count({
        where: {
          userToken: {
            userId,
          },
        },
      }),
    ]);

    return {
      records,
      total,
      page,
      pageSize,
    };
  }

  private async checkToken(userId: string) {
    const token = await this.prismaService.userToken.findFirst({
      where: {
        userId,
      },
    });
    if (!token || token?.amount < 0) {
      throw new HttpException(
        'token 数量不足',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async consumeToken(userId: string, totalTokens: number) {
    const currentToken = await this.prismaService.userToken.findFirst({
      where: {
        userId,
      },
    });

    if (!currentToken) {
      throw new HttpException(
        'token 数量不足',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.prismaService.userToken.update({
      where: {
        userId,
      },
      data:
        currentToken.amount - totalTokens < 0
          ? {
              amount: 0,
            }
          : {
              amount: {
                decrement: totalTokens,
              },
            },
    });
  }

  private async saveRecord(
    userId: string,
    amount: number,
    imgUrl: string,
    responseStr: any,
    type: 'CONSUME',
  ) {
    await this.prismaService.tokenUsageRecord.create({
      data: {
        amount: Number(amount),
        userToken: {
          connect: {
            userId,
          },
        },
        type,
        imgUrl,
        result: responseStr,
      },
    });
  }
}
