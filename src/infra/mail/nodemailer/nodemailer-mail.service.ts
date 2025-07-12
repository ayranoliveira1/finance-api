import { Mail } from '@/domain/application/mail/mail'
import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { google } from 'googleapis'

@Injectable()
export class NodemailerMailService implements Mail {
  constructor(private envService: EnvService) {}

  async sendEmail(to: string, name: string, subject: string, html: string) {
    const oauth2Client = new google.auth.OAuth2(
      this.envService.get('EMAIL_CLIENT_ID'),
      this.envService.get('EMAIL_CLIENT_SECRET'),
      this.envService.get('EMAIL_REDIRECT_URI'),
    )

    oauth2Client.setCredentials({
      refresh_token: this.envService.get('EMAIL_REFRESH_TOKEN'),
    })

    const { token } = await oauth2Client.getAccessToken()

    if (!token) {
      throw new Error('Failed to obtain access token for email sending')
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.envService.get('EMAIL_USER'),
        clientId: this.envService.get('EMAIL_CLIENT_ID'),
        clientSecret: this.envService.get('EMAIL_CLIENT_SECRET'),
        refreshToken: this.envService.get('EMAIL_REFRESH_TOKEN'),
        accessToken: token,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    const mailOptions = {
      from: this.envService.get('EMAIL_USER'),
      to,
      subject,
      html,
    }
    await transporter.sendMail(mailOptions)
  }
}
