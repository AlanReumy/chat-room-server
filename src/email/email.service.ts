import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter

  constructor() {
    this.transporter = createTransport({
      host: "smtp.qq.com",
      port: 587,
      secure: false,
      auth: {
        user: '',
        pass: ''
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '聊天室',
        address: ''
      },
      to,
      subject,
      html
    });
  }
}
