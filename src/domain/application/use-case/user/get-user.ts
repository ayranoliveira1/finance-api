import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user-repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { User } from '@/domain/enterprise/entities/user'
import { Either, left, right } from '@/core/either'

interface GetUserUseCaseRequest {
  userId: string
}

type GetUserUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    user: User
  }
>

@Injectable()
export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    return right({
      user,
    })
  }
}
