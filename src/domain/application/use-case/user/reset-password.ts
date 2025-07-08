import { Either, left, right } from '@/core/either'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user-repository'
import { HashGenerate } from '../../cryptography/hash-generate'
import { VerificationCodeExpiredError } from '@/core/@types/errors/verification-code-expired-error'
import { InvalidCodeError } from '@/core/@types/errors/invalid-code-error'

interface ResetPasswordUseCaseRequest {
  code: string
  email: string
  newPassword: string
  confirmNewPassword: string
}

type ResetPasswordUseCaseResponse = Either<
  InvalidCredentialsError | VerificationCodeExpiredError | InvalidCodeError,
  { Message: string }
>

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerate: HashGenerate,
  ) {}

  async execute({
    code,
    email,
    newPassword,
    confirmNewPassword,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    if (user.codeExpiresAt && user.codeExpiresAt < new Date()) {
      return left(new VerificationCodeExpiredError())
    }
    if (user.verificationCode !== code) {
      return left(new InvalidCodeError())
    }

    if (newPassword !== confirmNewPassword) {
      return left(new InvalidCredentialsError())
    }

    const hashedPassword = await this.hashGenerate.hash(newPassword)

    user.resetPassword(hashedPassword)

    await this.userRepository.save(user)

    return right({ Message: 'Password reset successfully' })
  }
}
