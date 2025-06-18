import { Either, left, right } from '@/core/either'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { HashCompare } from '../../cryptography/hash-compare'
import { Encrypter } from '../../cryptography/encrypter'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user-repository'
import { EmailNotVerifiedError } from '@/core/@types/errors/email-is-not-verified-error'
import { UserStatus } from '@/core/@types/enums'
import { UserNotActiveError } from '@/core/@types/errors/user-not-active-error'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  InvalidCredentialsError | EmailNotVerifiedError | UserNotActiveError,
  {
    token: string
    refreshToken: string
    userId: string
  }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashCompare: HashCompare,
    private encrypt: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    if (!user.isEmailVerified) {
      return left(new EmailNotVerifiedError())
    }

    if (user.status !== UserStatus.ACTIVE) {
      return left(new UserNotActiveError())
    }

    const passwordIsValid = await this.hashCompare.compare(
      password,
      user.password,
    )

    if (!passwordIsValid) {
      return left(new InvalidCredentialsError())
    }

    const token = await this.encrypt.encrypt({
      sub: user.id.toString(),
    })

    const refreshToken = await this.encrypt.encryptRefresh({
      sub: user.id.toString(),
    })

    return right({
      token,
      refreshToken,
      userId: user.id.toString(),
    })
  }
}
