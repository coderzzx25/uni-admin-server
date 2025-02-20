import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { MenuModule } from '../menu/menu.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    JwtModule.register({
      signOptions: {
        expiresIn: '1d',
      },
    }),
    UserModule,
    PermissionModule,
    MenuModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
