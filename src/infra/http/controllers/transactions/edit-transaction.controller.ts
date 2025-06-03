import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from '@/core/@types/enums'
import { EditTransactionUseCase } from '@/domain/application/use-case/transaction/edit-transaction'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const editTransactionBodySchema = z.object({
  name: z.string(),
  amount: z.number(),
  date: z.coerce.date(),
  category: z.nativeEnum(TransactionCategory),
  type: z.nativeEnum(TransactionType),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod),
})

type EditTransactionBodySchema = z.infer<typeof editTransactionBodySchema>

const bodyValidationType = new ZodValidationPipe(editTransactionBodySchema)

@Controller('/transactions/:transactionId')
export class EditTransactionController {
  constructor(private editTransaction: EditTransactionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationType) body: EditTransactionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('transactionId') transactionId: string,
  ) {
    editTransactionBodySchema.parse(body)
    const userId = user.sub

    const { name, amount, type, category, paymentMethod, date } = body

    const result = await this.editTransaction.execute({
      transactionId,
      name,
      amount,
      userId,
      date,
      category,
      paymentMethod,
      type,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
