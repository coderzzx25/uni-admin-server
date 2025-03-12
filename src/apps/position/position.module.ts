import { Module } from '@nestjs/common';
import { PositionController } from './position.controller';
import { PositionsService } from './position.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Positions } from 'src/entities/positions.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Positions]), AuthModule],
  controllers: [PositionController],
  providers: [PositionsService],
})
export class PositionModule {}
