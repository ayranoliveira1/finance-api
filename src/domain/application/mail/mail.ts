export abstract class Mail {
  abstract sendEmail(
    to: string,
    name: string,
    subject: string,
    body: string,
  ): Promise<void>

  abstract sendEmailResetPassword(
    to: string,
    name: string,
    subject: string,
    code: string,
  ): Promise<void>
}
