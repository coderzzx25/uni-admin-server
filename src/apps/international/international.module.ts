import { Module } from '@nestjs/common';
import { InternationalController } from './international.controller';
import { InternationalService } from './international.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { International } from 'src/entities/international.entity';
import { AuthModule } from '../auth/auth.module';
import redisModule from 'src/libs/redis.config';

@Module({
  imports: [TypeOrmModule.forFeature([International]), AuthModule],
  controllers: [InternationalController],
  providers: [InternationalService, redisModule],
})
export class InternationalModule {}
