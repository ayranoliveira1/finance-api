import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { VerifyUserUseCase } from './verify-user'
import { makeUser } from 'test/factories/make-user'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { EmailAlreadyVerifiedError } from '@/core/@types/errors/email-already-verified-error'
import { InvalidCodeError } from '@/core/@types/errors/invalid-code-error'
import { VerificationCodeExpiredError } from '@/core/@types/errors/verification-code-expired-error'

let inMemoryUserRepository: InMemoryUserRepository
let sut: VerifyUserUseCase

describe('Verify User Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new VerifyUserUseCase(inMemoryUserRepository)
  })

  it('should be able to verify a user', async () => {
    const user = makeUser({
      isEmailVerified: false,
      verificationCode: '123456',
      codeExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: user.email,
      code: user.verificationCode!,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0].isEmailVerified).toBe(true)
  })

  it('should not be able to verify a user with invalid email', async () => {
    const user = makeUser({
      isEmailVerified: false,
      verificationCode: '123456',
      codeExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: 'invalid-email',
      code: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryUserRepository.items[0].isEmailVerified).toBe(false)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to verify a user with already verified email', async () => {
    const user = makeUser({
      isEmailVerified: true,
      verificationCode: '123456',
      codeExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
    })
    await inMemoryUserRepository.create(user)
    const result = await sut.execute({
      email: user.email,
      code: '123456',
    })
    expect(result.isLeft()).toBe(true)
    expect(inMemoryUserRepository.items[0].isEmailVerified).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyVerifiedError)
  })

  it('should not be able to verify a user with invalid code', async () => {
    const user = makeUser({
      isEmailVerified: false,
      verificationCode: '123456',
      codeExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: user.email,
      code: '654321',
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryUserRepository.items[0].isEmailVerified).toBe(false)
    expect(result.value).toBeInstanceOf(InvalidCodeError)
  })

  it('should not be able to verify a user with expired code', async () => {
    const user = makeUser({
      isEmailVerified: false,
      verificationCode: '123456',
      codeExpiresAt: new Date(Date.now() - 1000 * 60 * 10),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: user.email,
      code: user.verificationCode!,
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryUserRepository.items[0].isEmailVerified).toBe(false)
    expect(result.value).toBeInstanceOf(VerificationCodeExpiredError)
  })
})
