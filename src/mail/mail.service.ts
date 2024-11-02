import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { createTransport, Transporter } from 'nodemailer';

interface SendMailDto {
  target: string;
  subject: string;
  text: string;
}

@Injectable()
export class MailService {
  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_USER: string;
  MAIL_PASS: string;
  transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.MAIL_HOST = this.configService.get<string>('SMTP_HOST');
    this.MAIL_PORT = this.configService.get<string>('SMTP_PORT');
    this.MAIL_USER = this.configService.get<string>('SMTP_USER');
    this.MAIL_PASS = this.configService.get<string>('SMTP_PASS');

    this.transporter = createTransport({
      host: this.MAIL_HOST,
      port: this.MAIL_PORT,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: this.MAIL_USER,
        pass: this.MAIL_PASS,
      },
    } as nodemailer.TransportOptions);
  }

  sendMail({ target, subject, text }: SendMailDto) {
    return this.transporter.sendMail({
      from: this.MAIL_USER,
      to: target,
      subject: subject,
      html: text,
    });
  }
}
