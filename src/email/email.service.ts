import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: "smtp.qq.com",
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_ADDRESS'),
        pass: this.configService.get('EMAIL_PASS')
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: this.configService.get('EMAIL_NAME'),
        address: this.configService.get('EMAIL_ADDRESS')
      },
      to,
      subject,
      html
    });
  }
}
