import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { UserRepository } from '../../repositories/user-repository'
import { Mail } from '../../mail/mail'

interface SendEmailResetPasswordUseCaseRequest {
  email: string
}

type SendEmailResetPasswordUseCaseResponse = Either<
  InvalidCredentialsError,
  null
>

@Injectable()
export class SendEmailResetPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private mail: Mail,
  ) {}

  async execute({
    email,
  }: SendEmailResetPasswordUseCaseRequest): Promise<SendEmailResetPasswordUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10)

    user.setVerificationCode(code, expiresAt)
    await this.userRepository.save(user)

    await this.mail.sendEmailResetPassword(
      user.email,
      user.name,
      'Redefinição de senha',
      user.verificationCode!,
    )

    return right(null)
  }
}
