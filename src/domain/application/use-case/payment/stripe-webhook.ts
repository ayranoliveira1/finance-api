import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user-repository'
import { StripeMethods } from '../../payment/stripe'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

interface StripeWebhookUseCaseRequest {
  payload: string
  signature: string
}

type StripeWebhookUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class StripeWebhookUseCase {
  constructor(
    private userRepository: UserRepository,
    private stripe: StripeMethods,
  ) {}

  async execute({
    payload,
    signature,
  }: StripeWebhookUseCaseRequest): Promise<StripeWebhookUseCaseResponse> {
    const event = await this.stripe.constructEvent(payload, signature)

    if (!event) {
      return left(new ResourceNotFoundError())
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.client_reference_id

        if (!userId) {
          return left(new ResourceNotFoundError())
        }

        const user = await this.userRepository.findById(userId)

        if (!user) {
          return left(new InvalidCredentialsError())
        }

        await this.userRepository.updatePlan(user.id.toString(), 'premium')
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const userId =
          subscription.metadata?.userId ||
          (subscription as any).client_reference_id

        if (!userId) {
          return left(new ResourceNotFoundError())
        }

        const user = await this.userRepository.findById(userId)

        if (!user) {
          return left(new InvalidCredentialsError())
        }

        await this.userRepository.updatePlan(user.id.toString(), 'free')
        break
      }
    }

    return right(null)
  }
}
