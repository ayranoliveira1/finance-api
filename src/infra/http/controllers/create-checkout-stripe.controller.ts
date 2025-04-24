import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'
import { UserAlreadyExistsError } from '@/domain/application/use-case/errors/user-already-exists-error'
import { UserAlreadyHasThePlanError } from '@/domain/application/use-case/errors/user-already-has-the-plan-error'
import { CreateCheckoutStripeUseCase } from '@/domain/application/use-case/payment/create-checkout-stripe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  NotAcceptableException,
  NotFoundException,
  Post,
} from '@nestjs/common'

@Controller('/checkout')
export class CreateCheckoutStripeController {
  constructor(private createCheckoutStripe: CreateCheckoutStripeUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.createCheckoutStripe.execute({
      userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new NotAcceptableException(error.message)
        case UserAlreadyHasThePlanError:
          throw new ConflictException(error.message)
        case NotAllowedError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      checkout_url: result.value.checkout_url,
    }
  }
}
