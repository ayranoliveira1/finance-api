import { StripeMethods } from '@/domain/application/payment/stripe'

export class FakerStripeMethods implements StripeMethods {
  async createCheckoutSession(userId: string, email: string) {
    return `https://fake-stripe.com/${userId}/${email}`
  }
}
