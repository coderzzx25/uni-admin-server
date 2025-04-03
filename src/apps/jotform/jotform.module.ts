import { Module } from '@nestjs/common';
import { JotformController } from './jotform.controller';
import { JotformService } from './jotform.service';

@Module({
  controllers: [JotformController],
  providers: [JotformService],
})
export class JotformModule {}
