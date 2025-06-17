import { EmailAlreadyVerifiedError } from '@/core/@types/errors/email-already-verified-error'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Mail } from '../../mail/mail'
import { UserRepository } from '../../repositories/user-repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

interface SendEmailUseCaseRequest {
  email: string
}

type SendEmailUseCaseResponse = Either<
  EmailAlreadyVerifiedError | InvalidCredentialsError,
  null
>

@Injectable()
export class SendEmailUseCase {
  constructor(
    private userRepository: UserRepository,
    private mail: Mail,
  ) {}

  async execute({
    email,
  }: SendEmailUseCaseRequest): Promise<SendEmailUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    if (user.isVerified) {
      return left(new EmailAlreadyVerifiedError())
    }

    await this.mail.sendEmail(
      user.email,
      'verifique seu e-mail',
      `Seu código de verificação é: ${user.verificationCode}`,
    )

    return right(null)
  }
}
