import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menus } from 'src/entities/menus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menus])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
