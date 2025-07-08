export abstract class Mail {
  abstract sendEmail(
    to: string,
    name: string,
    subject: string,
    html: string,
  ): Promise<void>
}
