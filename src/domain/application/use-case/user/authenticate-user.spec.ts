import { FakerHasher } from 'test/cryptography/faker-hasher'
import { FakerEncrypter } from 'test/cryptography/faker-encrypter'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { AuthenticateUserUseCase } from './authenticate-user'
import { makeUser } from 'test/factories/make-user'
import { EmailNotVerifiedError } from '@/core/@types/errors/email-is-not-verified-error'
import { UserStatus } from '@/core/@types/enums'
import { UserNotActiveError } from '@/core/@types/errors/user-not-active-error'

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
      isEmailVerified: true,
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
    const user = makeUser({
      isEmailVerified: true,
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: user.email,
      password: 'teste3009211',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate a user with unverified email', async () => {
    const user = makeUser({
      password: await fakerHash.hash('any_password'),
      isEmailVerified: false,
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: user.email,
      password: 'any_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailNotVerifiedError)
  })

  it('should not be able to authenticate a non-existing user', async () => {
    const user = makeUser({
      password: await fakerHash.hash('any_password'),
      status: UserStatus.INACTIVE,
      isEmailVerified: true,
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: user.email,
      password: 'any_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNotActiveError)
  })
})
