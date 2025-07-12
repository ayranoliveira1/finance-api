import { Either, left, right } from '@/core/either'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user-repository'
import { HashGenerate } from '../../cryptography/hash-generate'
import { VerificationCodeExpiredError } from '@/core/@types/errors/verification-code-expired-error'
import { InvalidCodeError } from '@/core/@types/errors/invalid-code-error'

interface ResetPasswordUseCaseRequest {
  code: string
  newPassword: string
  confirmNewPassword: string
}

type ResetPasswordUseCaseResponse = Either<
  InvalidCredentialsError | VerificationCodeExpiredError | InvalidCodeError,
  { message: string }
>

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerate: HashGenerate,
  ) {}

  async execute({
    code,
    newPassword,
    confirmNewPassword,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const user = await this.userRepository.findByVerificationCode(code)

    if (!user) {
      return left(new InvalidCodeError())
    }

    if (user.codeExpiresAt && user.codeExpiresAt < new Date()) {
      return left(new VerificationCodeExpiredError())
    }

    if (newPassword !== confirmNewPassword) {
      return left(new InvalidCredentialsError())
    }

    const hashedPassword = await this.hashGenerate.hash(newPassword)

    user.resetPassword(hashedPassword)

    await this.userRepository.save(user)

    return right({ message: 'Password reset successfully' })
  }
}
