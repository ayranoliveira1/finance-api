import { Either, left, right } from '@/core/either'
import { UserRepository } from '../../repositories/user-repository'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { HashCompare } from '../../cryptography/hash-compare'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { Injectable } from '@nestjs/common'

interface DeleteUserByUserUseCaseRequest {
  userId: string
  password: string
}

type DeleteUserByUserUseCaseResponse = Either<
  ResourceNotFoundError | InvalidCredentialsError,
  null
>

@Injectable()
export class DeleteUserByUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashCompare: HashCompare,
  ) {}

  async execute({
    userId,
    password,
  }: DeleteUserByUserUseCaseRequest): Promise<DeleteUserByUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const passwordIsValid = await this.hashCompare.compare(
      password,
      user.password,
    )

    if (!passwordIsValid) {
      return left(new InvalidCredentialsError())
    }

    await this.userRepository.delete(user)

    return right(null)
  }
}
