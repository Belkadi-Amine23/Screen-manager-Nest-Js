import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AUTH_CONSTANTS } from './constants';
import { IsLoggedInGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: AUTH_CONSTANTS.JWT_SECRET,
      signOptions: { expiresIn: AUTH_CONSTANTS.JWT_EXPIRATION },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, IsLoggedInGuard,
    {
      provide: APP_GUARD,
      useClass: IsLoggedInGuard,
    },
  ],
})
export class UserModule {}
