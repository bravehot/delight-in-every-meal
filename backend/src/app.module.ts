import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { RedisModule } from './common/redis/redis.module';
import { SmsModule } from './common/sms/sms.module';
import { CheckinModule } from './checkin/checkin.module';

import { JwtStrategy } from './common/strategy/jwt.strategy';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';
import { AiModule } from './ai/ai.module';
import { PointModule } from './point/point.module';
import { InviteModule } from './invite/invite.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    RedisModule,
    SmsModule,
    CheckinModule,
    AiModule,
    PointModule,
    InviteModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
