import { FakerStripeMethods } from 'test/payment/faker-stripe'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { CancelPlanStripeUseCase } from './cancel-plan-stripe'
import { makeUser } from 'test/factories/make-user'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'

let inMemoryUserRepository: InMemoryUserRepository
let fakerStripe: FakerStripeMethods
let sut: CancelPlanStripeUseCase

describe('CancelPlanStripeUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakerStripe = new FakerStripeMethods()
    sut = new CancelPlanStripeUseCase(inMemoryUserRepository, fakerStripe)
  })

  it('should be able to cancel a plan', async () => {
    const user = makeUser({
      email: 'test@example.com',
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      message: 'Subscription canceled successfully',
    })
  })

  it('should not be able to cancel a plan if user does not exist', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: 'non-existing-user-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to cancel a plan if user does not have a subscription', async () => {
    const user = makeUser({
      email: 'user2@example.com',
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
