import { Module } from '@nestjs/common';
import { JotformController } from './jotform.controller';
import { JotformService } from './jotform.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [NestjsFormDataModule],
  controllers: [JotformController],
  providers: [JotformService],
})
export class JotformModule {}
