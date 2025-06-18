import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user-repository'
import { Either, left, right } from '@/core/either'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { EmailAlreadyVerifiedError } from '@/core/@types/errors/email-already-verified-error'
import { InvalidCodeError } from '@/core/@types/errors/invalid-code-error'
import { VerificationCodeExpiredError } from '@/core/@types/errors/verification-code-expired-error'

interface VerifyUserUseCaseRequest {
  email: string
  code: string
}

type VerifyUserUseCaseResponse = Either<
  | InvalidCredentialsError
  | EmailAlreadyVerifiedError
  | InvalidCodeError
  | VerificationCodeExpiredError,
  null
>

@Injectable()
export class VerifyUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    code,
  }: VerifyUserUseCaseRequest): Promise<VerifyUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    if (user.isEmailVerified) {
      return left(new EmailAlreadyVerifiedError())
    }

    if (user.verificationCode !== code) {
      return left(new InvalidCodeError())
    }

    if (user.codeExpiresAt && user.codeExpiresAt < new Date()) {
      return left(new VerificationCodeExpiredError())
    }

    user.verify()

    await this.userRepository.save(user)

    return right(null)
  }
}
