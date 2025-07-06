import { Mail } from '@/domain/application/mail/mail'

export class FakerMail implements Mail {
  async sendEmail(to: string, subject: string, body: string) {
    console.log(`Email sent to: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${body}`)
  }

  async sendEmailResetPassword(to: string, subject: string, code: string) {
    console.log(`Email sent to: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${code}`)
  }
}
