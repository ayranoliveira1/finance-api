import { Either, left, right } from '@/core/either'
import { UserRepository } from '../repositories/user-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { User } from '@/domain/enterprise/entities/user'
import { HashCompare } from '../cryptography/hash-compare'
import { Encrypter } from '../cryptography/encrypter'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    user: User
    token: string
  }
>

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

    const passwordIsValid = this.hashCompare.compare(password, user.password)

    if (!passwordIsValid) {
      return left(new InvalidCredentialsError())
    }

    const token = await this.encrypt.encrypt({
      sub: user.id.toString(),
    })

    return right({
      token,
      user,
    })
  }
}
