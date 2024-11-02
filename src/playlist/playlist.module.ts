import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { PrismaService } from 'src/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService, PrismaService, MailService, ConfigService],
})
export class PlaylistModule {}
