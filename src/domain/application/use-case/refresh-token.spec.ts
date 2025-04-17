import { FakerHasher } from 'test/cryptography/faker-hasher'
import { FakerEncrypter } from 'test/cryptography/faker-encrypter'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { makeUser } from 'test/factories/make-user'
import { RefreshTokenUseCase } from './refresh-token'

let inMemoryUserRepository: InMemoryUserRepository
let fakerHash: FakerHasher
let fakerEcrypter: FakerEncrypter
let sut: RefreshTokenUseCase

describe('Refresh token', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakerHash = new FakerHasher()
    fakerEcrypter = new FakerEncrypter()

    sut = new RefreshTokenUseCase(inMemoryUserRepository, fakerEcrypter)
  })

  it('should be able refresh token', async () => {
    const user = makeUser({
      password: await fakerHash.hash('any_password'),
    })

    await inMemoryUserRepository.create(user)

    const refreshToken = await fakerEcrypter.encryptRefresh({
      sub: user.id.toString(),
    })

    const result = await sut.execute({
      refreshToken,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    )
  })

  it('should be able to disallow wrong tokens', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      refreshToken: await fakerEcrypter.encryptRefresh({
        sub: 'ajn3h8hd8h82h8h8d',
      }),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
