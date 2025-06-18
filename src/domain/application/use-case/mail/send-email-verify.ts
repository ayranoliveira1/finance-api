import { EmailAlreadyVerifiedError } from '@/core/@types/errors/email-already-verified-error'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Mail } from '../../mail/mail'
import { UserRepository } from '../../repositories/user-repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

interface SendEmailVerifyUseCaseRequest {
  email: string
}

type SendEmailVerifyUseCaseResponse = Either<
  EmailAlreadyVerifiedError | InvalidCredentialsError,
  null
>

@Injectable()
export class SendEmailVerifyUseCase {
  constructor(
    private userRepository: UserRepository,
    private mail: Mail,
  ) {}

  async execute({
    email,
  }: SendEmailVerifyUseCaseRequest): Promise<SendEmailVerifyUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    if (user.isEmailVerified) {
      return left(new EmailAlreadyVerifiedError())
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10)

    user.setVerificationCode(code, expiresAt)
    await this.userRepository.save(user)

    await this.mail.sendEmail(
      user.email,
      user.name,
      'Verifique seu e-mail',
      `Seu código de verificação é: ${user.verificationCode}`,
    )

    return right(null)
  }
}
