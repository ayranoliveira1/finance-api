import { StripeMethods } from '@/domain/application/payment/stripe'

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
}
