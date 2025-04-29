import Stripe from 'stripe'

export abstract class StripeMethods {
  abstract createCheckoutSession(
    userId: string,
    email: string,
  ): Promise<string | null>
  abstract constructEvent(
    payload: string,
    signature: string,
  ): Promise<Stripe.Event>
}
