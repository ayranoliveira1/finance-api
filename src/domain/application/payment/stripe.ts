export abstract class StripeMethods {
  abstract createCheckoutSession(
    userId: string,
    email: string,
  ): Promise<string | null>
}
