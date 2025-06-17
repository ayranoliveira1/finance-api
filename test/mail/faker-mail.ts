import { Mail } from '@/domain/application/mail/mail'

export class FakerMail implements Mail {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`Email sent to: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${body}`)
  }
}
