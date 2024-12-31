import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import * as dayjs from 'dayjs';

import { PrismaService } from 'src/common/prisma/prisma.service';
import { CHECK_IN_POINTS } from 'src/types/enum';

@Injectable()
export class CheckinService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkIn(userId: string) {
    const status = await this.getCheckInStatus(userId);
    if (status) {
      throw new HttpException('今天已签到', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const yesterday = dayjs().subtract(1, 'day');
    const checkIn = await this.prismaService.checkIn.findFirst({
      where: {
        userId,
        date: {
          gte: yesterday.startOf('day').toDate(),
          lte: yesterday.endOf('day').toDate(),
        },
      },
    });

    // 计算连续签到天数
    let consecutiveDays = 1;
    if (checkIn) {
      consecutiveDays = checkIn.consecutiveDays + 1;
      if (consecutiveDays > 7) {
        consecutiveDays = 1;
      }
    }

    const points =
      CHECK_IN_POINTS[`DAY_${consecutiveDays}` as keyof typeof CHECK_IN_POINTS];

    try {
      await this.prismaService.$transaction(async (prisma) => {
        const today = dayjs();

        const checkInRes = await prisma.checkIn.create({
          data: {
            userId,
            consecutiveDays,
            points,
            date: today.toDate(),
          },
        });

        const pointRes = await prisma.userPoints.upsert({
          where: { userId },
          create: {
            userId,
            points,
          },
          update: {
            points: {
              increment: points,
            },
          },
        });

        return {
          points: pointRes.points,
          consecutiveDays: checkInRes.consecutiveDays,
        };
      });
    } catch (error) {
      console.log('error: ', error);
      throw new HttpException('签到失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCheckInHistory(userId: string) {
    const history = await this.prismaService.checkIn.findMany({
      where: {
        userId,
        date: {
          gte: dayjs().subtract(7, 'days').startOf('day').toDate(),
          lte: dayjs().endOf('day').toDate(),
        },
      },
      orderBy: {
        date: 'desc',
      },
      select: {
        points: true,
        consecutiveDays: true,
        date: true,
      },
    });

    return new Array(7)
      .fill({})
      .map((_, index) => {
        const info = {
          checkInStatus: false,
          points: null,
          consecutiveDays: null,
          date: dayjs().subtract(index, 'days').toDate(),
        };
        const find = history.find((h) =>
          dayjs(h.date).isSame(info.date, 'day'),
        );
        return {
          checkInStatus: !isEmpty(find),
          points: find?.points || null,
          consecutiveDays: find?.consecutiveDays || null,
          date: info.date,
        };
      })
      .reverse()
      .filter((item) => item.checkInStatus);
  }

  async getCheckInStatus(userId: string) {
    const today = dayjs();
    const checkIn = await this.prismaService.checkIn.findFirst({
      where: {
        userId,
        date: {
          gte: today.startOf('day').toDate(),
          lte: today.endOf('day').toDate(),
        },
      },
    });

    return checkIn;
  }
}
