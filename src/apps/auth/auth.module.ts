import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { MenuModule } from '../menu/menu.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    JwtModule.register({
      signOptions: {
        expiresIn: '1d',
      },
    }),
    UserModule,
    RoleModule,
    MenuModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
