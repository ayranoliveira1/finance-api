import { StripeMethods } from '@/domain/application/payment/stripe'
import Stripe from 'stripe'

interface FakeEvent {
  type: string
  data: {
    object: any
  }
}
export class FakerStripeMethods implements StripeMethods {
  private fakeEvent: FakeEvent | null = null
  private shouldThrowError = false

  async createCheckoutSession(userId: string, email: string) {
    return `https://fake-stripe.com/${userId}/${email}`
  }

  async constructEvent(payload: string, signature: string) {
    if (this.shouldThrowError) {
      throw new Error('Stripe signature verification failed')
    }

    if (signature !== 'fake_signature') {
      throw new Error('Invalid signature')
    }

    if (!this.fakeEvent) {
      const { userId } = JSON.parse(payload)

      return {
        id: 'evt_fake_id',
        object: 'event',
        api_version: '2020-08-27',
        created: Date.now(),
        type: 'invoice.payment_succeeded',
        data: {
          object: {
            metadata: {
              userId: userId,
            },
          },
        },
        livemode: false,
        pending_webhooks: 0,
        request: {
          id: 'req_fake_id',
          idempotency_key: null,
        },
      } as any
    }

    return {
      id: 'evt_fake_id',
      object: 'event',
      api_version: '2020-08-27',
      created: Date.now(),
      livemode: false,
      pending_webhooks: 0,
      request: {
        id: 'req_fake_id',
        idempotency_key: null,
      },
      ...this.fakeEvent,
    }
  }

  setFakeEvent(event: FakeEvent) {
    this.fakeEvent = event
  }

  simulateError() {
    this.shouldThrowError = true
  }

  async cancelSubscription(subscriptionId: string) {
    if (subscriptionId === 'fake_subscription_id') {
      return {
        id: subscriptionId,
        object: 'subscription',
        status: 'canceled',
        customer: 'fake_customer_id',
        items: {
          object: 'list',
          data: [],
          has_more: false,
          url: '/v1/subscription_items',
        },
        application: null,
        application_fee_percent: null,

        billing_cycle_anchor: Date.now() / 1000,
        cancel_at: null,
        cancel_at_period_end: false,
        canceled_at: Date.now() / 1000,
        collection_method: 'charge_automatically',
        created: Date.now() / 1000,
        currency: 'usd',
        days_until_due: null,
        default_payment_method: null,
        default_source: null,
        default_tax_rates: [],
        description: null,
        ended_at: Date.now() / 1000,

        latest_invoice: null,
        livemode: false,
        metadata: {},
        next_pending_invoice_item_invoice: null,
        on_behalf_of: null,
        pause_collection: null,
        payment_settings: null,
        pending_invoice_item_interval: null,
        pending_setup_intent: null,
        pending_update: null,
        schedule: null,
        start_date: Date.now() / 1000,
        test_clock: null,
        transfer_data: null,
        trial_end: null,
        trial_start: null,
        trial_settings: null,

        automatic_tax: {
          enabled: false,
          disabled_reason: null,
          liability: null,
        },
        billing_cycle_anchor_config: null,
        cancellation_details: {
          comment: null,
          feedback: null,
          reason: null,
        },
        discounts: [],
        invoice_settings: {
          account_tax_ids: null,
          issuer: { type: 'self' },
        },
      } as Stripe.Subscription
    }

    return null
  }

  async listSubscriptionsByEmail(email: string) {
    if (email === 'test@example.com') {
      return [
        {
          id: 'sub_test_id_1',
          object: 'subscription',
          status: 'active',
          customer: 'cus_test_id',
          items: {
            object: 'list',
            data: [],
            has_more: false,
            url: '/v1/subscription_items',
          },
          application: null,
          application_fee_percent: null,
          billing_cycle_anchor: Date.now() / 1000,
          cancel_at: null,
          cancel_at_period_end: false,
          canceled_at: Date.now() / 1000,
          collection_method: 'charge_automatically',
          created: Date.now() / 1000,
          currency: 'usd',
          days_until_due: null,
          default_payment_method: null,
          default_source: null,
          default_tax_rates: [],
          description: null,
          ended_at: Date.now() / 1000,
          latest_invoice: null,
          livemode: false,
          metadata: {},
          next_pending_invoice_item_invoice: null,
          on_behalf_of: null,
          pause_collection: null,
          payment_settings: null,
          pending_invoice_item_interval: null,
          pending_setup_intent: null,
          pending_update: null,
          schedule: null,
          start_date: Date.now() / 1000,
          test_clock: null,
          transfer_data: null,
          trial_end: null,
          trial_start: null,
          trial_settings: null,
          automatic_tax: {
            enabled: false,
            disabled_reason: null,
            liability: null,
          },
          billing_cycle_anchor_config: null,
          cancellation_details: {
            comment: null,
            feedback: null,
            reason: null,
          },
          discounts: [],
          invoice_settings: {
            account_tax_ids: null,
            issuer: { type: 'self' },
          },
        } as Stripe.Subscription,
      ]
    }

    return null
  }
}
