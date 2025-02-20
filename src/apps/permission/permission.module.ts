import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from 'src/entities/permissions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permissions])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
