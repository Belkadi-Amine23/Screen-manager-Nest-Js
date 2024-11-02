import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, PlaylistModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
