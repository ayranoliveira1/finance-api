export abstract class Mail {
  abstract sendEmail(
    to: string,
    name: string,
    subject: string,
    body: string,
  ): Promise<void>
}
