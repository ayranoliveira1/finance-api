import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repositories/user-repository'
import { Encrypter } from '../cryptography/encrypter'
import { Either, right } from '@/core/either'
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

    const token = await this.encrypt.encrypt({
      sub: payload.sub,
    })

    const newRefreshToken = await this.encrypt.encryptRefresh({
      sub: payload.sub,
    })

    return right({
      token,
      refreshToken: newRefreshToken,
    })
  }
}
