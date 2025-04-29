import { FakerStripeMethods } from 'test/payment/faker-stripe'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { StripeWebhookUseCase } from './stripe-webhook'
import { makeUser } from 'test/factories/make-user'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'

let fakerStripeMethod: FakerStripeMethods
let inMemoryUserRepository: InMemoryUserRepository
let sut: StripeWebhookUseCase

describe('StripeWebhookUseCase', () => {
  beforeEach(() => {
    fakerStripeMethod = new FakerStripeMethods()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new StripeWebhookUseCase(inMemoryUserRepository, fakerStripeMethod)
  })

  it('should be able to handle a stripe webhook event', async () => {
    const user = makeUser({
      subscriptionPlan: 'FREE',
    })

    inMemoryUserRepository.items.push(user)

    fakerStripeMethod.setFakeEvent({
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: user.id.toString(),
        },
      },
    })

    const payload = JSON.stringify({ userId: user.id.toString() })

    const result = await sut.execute({
      payload,
      signature: 'fake_signature',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0].subscriptionPlan).toEqual('PREMIUM')
  })

  it('should be able to handle a stripe webhook event with customer.subscription.deleted', async () => {
    const user = makeUser({
      subscriptionPlan: 'PREMIUM',
    })

    inMemoryUserRepository.items.push(user)

    fakerStripeMethod.setFakeEvent({
      type: 'customer.subscription.deleted',
      data: {
        object: {
          metadata: {
            userId: user.id.toString(),
          },
        },
      },
    })

    const payload = JSON.stringify({ userId: user.id.toString() })

    const result = await sut.execute({
      payload,
      signature: 'fake_signature',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0].subscriptionPlan).toEqual('FREE')
  })

  it('should return an error if the user is not found', async () => {
    const user = makeUser()

    inMemoryUserRepository.items.push(user)

    fakerStripeMethod.setFakeEvent({
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: {
            userId: user.id.toString(),
          },
        },
      },
    })

    const result = await sut.execute({
      payload: 'no-user',
      signature: 'fake_signature',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
