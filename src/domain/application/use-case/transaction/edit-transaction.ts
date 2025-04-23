import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from '@/core/@types/enums'
import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '../../repositories/transaction-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'

interface EditTransactionUseCaseRequest {
  transactionId: string
  name: string
  type: TransactionType
  category: TransactionCategory
  paymentMethod: TransactionPaymentMethod
  amount: number
  userId: string
  date: Date
}

type EditTransactionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class EditTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    transactionId,
    name,
    type,
    category,
    paymentMethod,
    amount,
    userId,
    date,
  }: EditTransactionUseCaseRequest): Promise<EditTransactionUseCaseResponse> {
    const transaction = await this.transactionRepository.findById(transactionId)

    if (!transaction) {
      return left(new ResourceNotFoundError())
    }

    if (transaction.userId.toString() !== userId) {
      return left(new NotAllowedError())
    }

    transaction.name = name
    transaction.type = type
    transaction.category = category
    transaction.paymentMethod = paymentMethod
    transaction.amount = amount
    transaction.date = date

    await this.transactionRepository.save(transaction)

    return right(null)
  }
}
