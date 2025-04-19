import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from '@/core/@types/enums'
import { CreateTransactionUseCase } from '@/domain/application/use-case/transaction/create-transaction'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const createTransactionBodySchema = z.object({
  name: z.string(),
  amount: z.number(),
  category: z.nativeEnum(TransactionCategory),
  type: z.nativeEnum(TransactionType),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod),
})

type CreateTransactionBodySchema = z.infer<typeof createTransactionBodySchema>

const bodyValidationType = new ZodValidationPipe(createTransactionBodySchema)

@Controller('/transactions')
export class CreateTransactionController {
  constructor(private createTransaction: CreateTransactionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationType) body: CreateTransactionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    createTransactionBodySchema.parse(body)
    const userId = user.sub

    const { name, amount, category, type, paymentMethod } = body

    const result = await this.createTransaction.execute({
      name,
      amount,
      userId,
      date: new Date(),
      category,
      paymentMethod,
      type,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value)
    }
  }
}
