import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { StripeMethods } from '../../payment/stripe'
import { UserAlreadyHasThePlanError } from '../errors/user-already-has-the-plan-error'

interface CreateCheckoutStripeUseCaseRequest {
  userId: string
}

type CreateCheckoutStripeUseCaseResponse = Either<
  NotAllowedError | UserAlreadyExistsError,
  {
    checkout_url: string
  }
>

@Injectable()
export class CreateCheckoutStripeUseCase {
  constructor(
    private userRepository: UserRepository,
    private stripe: StripeMethods,
  ) {}
  async execute({
    userId,
  }: CreateCheckoutStripeUseCaseRequest): Promise<CreateCheckoutStripeUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new UserAlreadyExistsError(userId))
    }

    if (user.role !== 'USER') {
      return left(new UserAlreadyHasThePlanError())
    }

    const session = await this.stripe.createCheckoutSession(userId, user.email)

    if (!session) {
      return left(new NotAllowedError())
    }

    return right({
      checkout_url: session,
    })
  }
}
