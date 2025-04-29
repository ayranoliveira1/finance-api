import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { makeUser } from 'test/factories/make-user'
import { GetUserUseCase } from './get-user'

let inMemoryUserRepository: InMemoryUserRepository

let sut: GetUserUseCase

describe('Get User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new GetUserUseCase(inMemoryUserRepository)
  })

  it('should be able to Get a user', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: user.id,
          email: user.email,
        }),
      }),
    )
  })

  it('should return an error for a non-existing user', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: 'non-existing-user-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
