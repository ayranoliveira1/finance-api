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
      success_url: `${process.env.APP_URL!}/success`,
      cancel_url: `${process.env.APP_URL!}/cancel`,
      customer_email: email,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        userEmail: email,
      },
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
    })

    return session.url
  }

  async constructEvent(payload: string, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.envService.get('STRIPE_WEBHOOK_SECRET'),
    )
  }

  async cancelSubscription(subscriptionId: string) {
    const subscription = await this.stripe.subscriptions.cancel(subscriptionId)

    if (!subscription) {
      return null
    }

    return subscription
  }

  async listSubscriptionsByEmail(email: string) {
    const customers = await this.stripe.customers.list({ email, limit: 1 })

    if (customers.data.length === 0) {
      return null
    }

    const customerId = customers.data[0].id

    const subscriptions = await this.stripe.subscriptions.list({
      customer: customerId,
    })

    if (!subscriptions) {
      return null
    }

    return subscriptions.data
  }
}
