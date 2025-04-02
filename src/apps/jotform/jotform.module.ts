import { Module } from '@nestjs/common';
import { JotformController } from './jotform.controller';
import { JotformService } from './jotform.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [JotformController],
  providers: [JotformService],
})
export class JotformModule {}
