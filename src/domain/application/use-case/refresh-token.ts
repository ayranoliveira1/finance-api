import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repositories/user-repository'
import { Encrypter } from '../cryptography/encrypter'
import { Either, left, right } from '@/core/either'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface RefreshTokenUseCaseRequest {
  refreshToken: string
}

type RefreshTokenUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    token: string
    refreshToken: string
  }
>
@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private userRepository: UserRepository,
    private encrypt: Encrypter,
  ) {}

  async execute({
    refreshToken,
  }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
    const payload = await this.encrypt.decryptRefresh(refreshToken)

    const user = await this.userRepository.findById(payload.sub as string)

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    const token = await this.encrypt.encrypt({
      sub: user.id,
    })

    const newRefreshToken = await this.encrypt.encryptRefresh({
      sub: user.id,
    })

    return right({
      token,
      refreshToken: newRefreshToken,
    })
  }
}
