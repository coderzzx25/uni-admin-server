import { Module } from '@nestjs/common';

import configModel from './libs/env.config';
import typeormModule from './libs/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './apps/auth/auth.module';
import { UserModule } from './apps/user/user.module';
import { MenuModule } from './apps/menu/menu.module';
import { RoleModule } from './apps/role/role.module';
import { PositionModule } from './apps/position/position.module';
import { InternationalModule } from './apps/international/international.module';
import { DepartmentModule } from './apps/department/department.module';
import { TestModule } from './apps/test/test.module';
import redisModule from './libs/redis.config';

@Module({
  imports: [
    configModel,
    typeormModule,
    AuthModule,
    UserModule,
    MenuModule,
    RoleModule,
    PositionModule,
    InternationalModule,
    DepartmentModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService, redisModule],
})
export class AppModule {}
