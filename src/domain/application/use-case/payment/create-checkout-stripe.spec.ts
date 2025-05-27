import { FakerStripeMethods } from 'test/payment/faker-stripe'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { CreateCheckoutStripeUseCase } from './create-checkout-stripe'
import { makeUser } from 'test/factories/make-user'
import { UserAlreadyHasThePlanError } from '../errors/user-already-has-the-plan-error'

let fakerStripeMethod: FakerStripeMethods
let inMemoryUserRepository: InMemoryUserRepository
let sut: CreateCheckoutStripeUseCase

describe('CreateCheckoutStripeUseCase', () => {
  beforeEach(() => {
    fakerStripeMethod = new FakerStripeMethods()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new CreateCheckoutStripeUseCase(
      inMemoryUserRepository,
      fakerStripeMethod,
    )
  })

  it('should be able to create a checkout stripe session', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    console.log(result)

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      checkout_url: `https://fake-stripe.com/${user.id.toString()}/${user.email}`,
    })
  })

  it('should not be able to create a checkout stripe session if user does not exist', async () => {
    const user = makeUser()

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should not be able to create a checkout stripe session if user is not a USER', async () => {
    const user = makeUser({
      subscriptionPlan: 'PREMIUM',
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyHasThePlanError)
  })
})
