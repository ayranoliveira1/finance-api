import { FakerMail } from 'test/mail/faker-mail'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { makeUser } from 'test/factories/make-user'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { SendEmailResetPasswordUseCase } from './send-email-reset-password'

let inMemoryUserRepository: InMemoryUserRepository
let fakerMail: FakerMail
let sut: SendEmailResetPasswordUseCase

describe('SendEmailResetPasswordUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakerMail = new FakerMail()
    sut = new SendEmailResetPasswordUseCase(inMemoryUserRepository, fakerMail)
  })

  it('should be able to send an email to a user with an unverified email', async () => {
    const user = makeUser()

    inMemoryUserRepository.items.push(user)

    const result = await sut.execute({
      email: user.email,
    })

    expect(result.isRight()).toBe(true)
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
