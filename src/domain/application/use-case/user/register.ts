import { Either, left, right } from '@/core/either'
import { HashGenerate } from '../../cryptography/hash-generate'
import { UserRepository } from '../../repositories/user-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { User } from '@/domain/enterprise/entities/user'
import { Injectable } from '@nestjs/common'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterUseCaseResponse = Either<UserAlreadyExistsError, { user: User }>

@Injectable()
export class RegisterUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerate: HashGenerate,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userExists = await this.userRepository.findByEmail(email)

    if (userExists) {
      return left(new UserAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerate.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.userRepository.create(user)

    return right({ user })
  }
}
