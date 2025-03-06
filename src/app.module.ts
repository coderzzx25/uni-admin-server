import { Module } from '@nestjs/common';

import configModel from './libs/env.config';
import typeormModule from './libs/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './apps/auth/auth.module';
import { UserModule } from './apps/user/user.module';
import { MenuModule } from './apps/menu/menu.module';
import { RoleModule } from './apps/role/role.module';
import { PermissionModule } from './apps/permission/permission.module';
import { ChatGateway } from './apps/chat/chat.gateway';
import { ChatModule } from './apps/chat/chat.module';
import { JobModule } from './apps/job/job.module';
import redisModule from './libs/redis.config';

@Module({
  imports: [
    configModel,
    typeormModule,
    AuthModule,
    UserModule,
    MenuModule,
    RoleModule,
    PermissionModule,
    ChatModule,
    JobModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, redisModule],
})
export class AppModule {}
