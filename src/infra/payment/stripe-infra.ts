import { StripeMethods } from '@/domain/application/payment/stripe'
import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { EnvService } from '../env/env.service'

@Injectable()
export class StripeInfraMethods implements StripeMethods {
  public stripe: Stripe

  constructor(private envService: EnvService) {
    this.stripe = new Stripe(this.envService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-03-31.basil',
    })
  }

  async createCheckoutSession(
    userId: string,
    email: string,
  ): Promise<string | null> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: this.envService.get('STRIPE_PREMIUM_PLAN_PRICE_ID'),
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: process.env.APP_URL!,
      cancel_url: process.env.APP_URL!,
      customer_email: email,
      client_reference_id: userId,
      metadata: { userId },
    })

    return session.url
  }
}
