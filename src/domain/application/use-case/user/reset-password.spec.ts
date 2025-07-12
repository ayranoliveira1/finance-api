import { FakerHasher } from 'test/cryptography/faker-hasher'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { ResetPasswordUseCase } from './reset-password'
import { makeUser } from 'test/factories/make-user'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { VerificationCodeExpiredError } from '@/core/@types/errors/verification-code-expired-error'
import { InvalidCodeError } from '@/core/@types/errors/invalid-code-error'

let inMemoryUserRepository: InMemoryUserRepository
let fakerHasher: FakerHasher
let sut: ResetPasswordUseCase

describe('Reset Password Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakerHasher = new FakerHasher()
    sut = new ResetPasswordUseCase(inMemoryUserRepository, fakerHasher)
  })

  it('should reset the user password successfully', async () => {
    const user = makeUser({
      verificationCode: '123456',
      codeExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      code: user.verificationCode!,
      newPassword: 'new_password',
      confirmNewPassword: 'new_password',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      message: 'Password reset successfully',
    })
  })

  it('should reset the user password with a new hashed password', async () => {
    const user = makeUser({
      verificationCode: '123456',
      codeExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
    })
    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      code: user.verificationCode!,
      newPassword: 'new_password',
      confirmNewPassword: 'new_password',
    })

    const hashedPassword = await fakerHasher.hash('new_password')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0].password).toBe(hashedPassword)
  })

  it('should return an error if the verification code is expired', async () => {
    const user = makeUser({
      verificationCode: '123456',
      codeExpiresAt: new Date(Date.now() - 1000 * 60 * 10),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      code: user.verificationCode!,
      newPassword: 'new_password',
      confirmNewPassword: 'new_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(VerificationCodeExpiredError)
  })

  it('should return an error if the verification code is invalid', async () => {
    const user = makeUser({
      verificationCode: '123456',
      codeExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      code: 'invalid_code',
      newPassword: 'new_password',
      confirmNewPassword: 'new_password',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCodeError)
  })

  it('should return an error if the new password and confirm password do not match', async () => {
    const user = makeUser({
      verificationCode: '123456',
      codeExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      code: user.verificationCode!,
      newPassword: 'new_password',
      confirmNewPassword: 'different_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
