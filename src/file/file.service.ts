import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { existsSync } from 'fs';
import { PrismaService } from 'src/prisma.service';
import renderMissingFilesEmail from './missingFiles';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class FileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  @Cron('13 17,18,19 * * *')
  async checkFileExistence() {
    console.log('Executing...');
    const files = await this.prismaService.media.findMany({
      select: {
        path: true,
      },
    });
    const missingFiles = files
      .filter(({ path }) => !existsSync(path))
      .map(({ path }) => path);
    const html = await renderMissingFilesEmail(missingFiles);
    await this.mailService.sendMail({
      target: 'youn.henni@gmail.com',
      subject: `Missing files report - ${new Date().toLocaleDateString()}`,
      text: html,
    });
  }
}
