import { FakerMail } from 'test/mail/faker-mail'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { SendEmailUseCase } from './send-email'
import { makeUser } from 'test/factories/make-user'
import { EmailAlreadyVerifiedError } from '@/core/@types/errors/email-already-verified-error'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

let inMemoryUserRepository: InMemoryUserRepository
let fakerMail: FakerMail
let sut: SendEmailUseCase

describe('SendEmailUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakerMail = new FakerMail()
    sut = new SendEmailUseCase(inMemoryUserRepository, fakerMail)
  })

  it('should be able to send an email to a user with an unverified email', async () => {
    const user = makeUser()

    inMemoryUserRepository.items.push(user)

    const result = await sut.execute({
      email: user.email,
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to send an email to a user with a verified email', async () => {
    const user = makeUser({
      isVerified: true,
    })

    inMemoryUserRepository.items.push(user)

    const result = await sut.execute({
      email: user.email,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyVerifiedError)
  })

  it('should not be able to send an email to a non-existing user', async () => {
    const user = makeUser()

    inMemoryUserRepository.items.push(user)

    const result = await sut.execute({
      email: 'example@example.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
