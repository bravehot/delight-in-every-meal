import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as STS from 'qcloud-cos-sts';

@Injectable()
export class CosService {
  constructor(private readonly configService: ConfigService) {}

  async getSTSConfig(userId: string) {
    const SecretId = this.configService.get<string>('SECRET_ID');
    const SecretKey = this.configService.get<string>('SECRET_KEY');
    const Bucket = this.configService.get<string>('BUCKET_NAME');

    if (!SecretId || !SecretKey) {
      throw new HttpException(
        'COS SecretId or SecretKey not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const result = await STS.getCredential({
      secretId: SecretId,
      secretKey: SecretKey,
      durationSeconds: 180,
      policy: {
        version: '2.0',
        statement: [
          {
            action: ['name/cos:PutObject'],
            effect: 'allow',
            resource: [
              `qcs::cos:ap-beijing:uid/1257872790:${Bucket}/app/analysis/${userId}/*`,
            ],
          },
        ],
      },
    });

    return result;
  }
}
