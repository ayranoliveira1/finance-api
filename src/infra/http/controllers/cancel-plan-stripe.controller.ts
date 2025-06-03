import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { CancelPlanStripeUseCase } from '@/domain/application/use-case/payment/cancel-plan-stripe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  HttpCode,
  NotAcceptableException,
  Post,
} from '@nestjs/common'

@Controller('/subscription/cancel')
export class CancelPlanStripeController {
  constructor(private cancelPlan: CancelPlanStripeUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.cancelPlan.execute({
      userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case NotAllowedError:
          throw new NotAcceptableException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
