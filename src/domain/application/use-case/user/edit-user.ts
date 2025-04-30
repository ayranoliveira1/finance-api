import { Either, left, right } from '@/core/either'
import { HashCompare } from '../../cryptography/hash-compare'
import { HashGenerate } from '../../cryptography/hash-generate'
import { UserRepository } from '../../repositories/user-repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface EditUserUseCaseRequest {
  userId: string
  name?: string
  email?: string
  confirmPassword?: string
  newPassword?: string
}

type EditUserUseCaseResponse = Either<
  InvalidCredentialsError | UserAlreadyExistsError | ResourceNotFoundError,
  null
>

@Injectable()
export class EditUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashCompare: HashCompare,
    private hashGenerate: HashGenerate,
  ) {}

  async execute({
    userId,
    name,
    email,
    confirmPassword,
    newPassword,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (confirmPassword && !newPassword) {
      return left(new ResourceNotFoundError())
    }

    if (!confirmPassword && newPassword) {
      return left(new InvalidCredentialsError())
    }

    if (confirmPassword && newPassword) {
      const passwordIsValid = await this.hashCompare.compare(
        confirmPassword,
        user.password,
      )

      if (!passwordIsValid) {
        return left(new InvalidCredentialsError())
      }

      const hashedPassword = await this.hashGenerate.hash(newPassword)

      user.password = hashedPassword

      await this.userRepository.save(user)
    }

    if (name) {
      user.name = name

      await this.userRepository.save(user)
    }

    if (email) {
      const userWithSameEmail = await this.userRepository.findByEmail(email)

      if (userWithSameEmail && userWithSameEmail.id.toString() !== userId) {
        return left(new UserAlreadyExistsError(email))
      }

      user.email = email

      await this.userRepository.save(user)
    }

    return right(null)
  }
}
