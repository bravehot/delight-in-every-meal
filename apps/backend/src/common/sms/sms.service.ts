import { Inject, Injectable } from '@nestjs/common';
import { getRandomCode } from 'src/utils';

@Injectable()
export class SmsService {
  @Inject('SMS_CLIENT')
  private smsClient: any;

  async sendSmsCode() {
    console.log('smsClient: ', this.smsClient);
    return getRandomCode();
  }
}
