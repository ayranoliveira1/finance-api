export abstract class Mail {
  abstract sendEmail(to: string, subject: string, body: string): Promise<void>
}
