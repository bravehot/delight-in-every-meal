import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as tencentcloud from 'tencentcloud-sdk-nodejs';

import { SmsService } from './sms.service';

@Global()
@Module({
  providers: [
    SmsService,
    {
      provide: 'SMS_CLIENT',
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        const SmsClient = tencentcloud.sms.v20210111.Client;
        const client = new SmsClient({
          credential: {
            secretId: configService.get('SMS_SECRET_ID'),
            secretKey: configService.get('SMS_SECRET_KEY'),
          },
          region: 'ap-guangzhou',
          profile: {
            httpProfile: {
              endpoint: 'sms.tencentcloudapi.com',
            },
          },
        });
        return client;
      },
    },
  ],
  exports: [SmsService],
})
export class SmsModule {}
