import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeleteTransactionUseCase } from '@/domain/application/use-case/transaction/delete-transaction'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'

const deleteTransactionBodySchema = z.object({
  transactionId: z.string().uuid(),
})

type DeleteTransactionBodyType = z.infer<typeof deleteTransactionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(deleteTransactionBodySchema)

@Controller('/transactions')
export class DeleteTransactionController {
  constructor(private deleteTranasction: DeleteTransactionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: DeleteTransactionBodyType,
    @CurrentUser() user: UserPayload,
  ) {
    deleteTransactionBodySchema.parse(body)

    const { transactionId } = body
    const userId = user.sub

    const result = await this.deleteTranasction.execute({
      transactionId,
      userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
