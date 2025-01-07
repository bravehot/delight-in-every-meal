import { Module } from '@nestjs/common';
import { CosService } from './cos.service';
import { CosController } from './cos.controller';

@Module({
  controllers: [CosController],
  providers: [CosService],
})
export class CosModule {}
