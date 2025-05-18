import { Injectable } from '@nestjs/common'
import { StripeMethods } from '../../payment/stripe'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { UserRepository } from '../../repositories/user-repository'
import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'

interface CancelPlanStripeUseCaseRequest {
  userId: string
}

type CancelPlanStripeUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    message: string
  }
>

@Injectable()
export class CancelPlanStripeUseCase {
  constructor(
    private userRepository: UserRepository,
    private stripe: StripeMethods,
  ) {}

  async execute({
    userId,
  }: CancelPlanStripeUseCaseRequest): Promise<CancelPlanStripeUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const subscription = await this.stripe.listSubscriptionsByEmail(user.email)

    if (!subscription) {
      return left(new NotAllowedError())
    }
    const subscriptionId = subscription[0].id

    await this.stripe.cancelSubscription(subscriptionId)

    return right({
      message: 'Subscription canceled successfully',
    })
  }
}
