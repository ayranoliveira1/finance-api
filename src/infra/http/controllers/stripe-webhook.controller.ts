import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { InvalidCredentialsError } from '@/domain/application/use-case/errors/invalid-credentials-error'
import { StripeWebhookUseCase } from '@/domain/application/use-case/payment/stripe-webhook'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common'
import { Request as ExpressRequest } from 'express'

@Controller('/stripe/webhook')
@Public()
export class StripeWebhookController {
  constructor(private stripeWebhook: StripeWebhookUseCase) {}

  @Post()
  @HttpCode(201)
  async webhook(@Request() request: ExpressRequest) {
    const signature = request.headers['stripe-signature']

    const rawBody = request.body.toString('utf8')

    const result = await this.stripeWebhook.execute({
      payload: rawBody,
      signature: signature as string,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
