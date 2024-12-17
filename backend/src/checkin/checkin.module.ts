import { Module } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CheckinController } from './checkin.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  controllers: [CheckinController],
  providers: [CheckinService, PrismaService],
})
export class CheckinModule {}
