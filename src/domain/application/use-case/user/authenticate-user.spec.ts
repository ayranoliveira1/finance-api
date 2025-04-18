import { FakerHasher } from 'test/cryptography/faker-hasher'
import { FakerEncrypter } from 'test/cryptography/faker-encrypter'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { AuthenticateUserUseCase } from './authenticate-user'
import { makeUser } from 'test/factories/make-user'

let inMemoryUserRepository: InMemoryUserRepository
let fakerHash: FakerHasher
let fakerEcrypter: FakerEncrypter
let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakerHash = new FakerHasher()
    fakerEcrypter = new FakerEncrypter()
    sut = new AuthenticateUserUseCase(
      inMemoryUserRepository,
      fakerHash,
      fakerEcrypter,
    )
  })

  it('should be able to Authenticate a user', async () => {
    const user = makeUser({
      password: await fakerHash.hash('any_password'),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: user.email,
      password: 'any_password',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    )
  })

  it('should hash user password upon authenticate', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: user.email,
      password: 'teste3009211',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
