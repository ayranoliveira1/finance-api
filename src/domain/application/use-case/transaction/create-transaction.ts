import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from '@/core/@types/enums'
import { TransactionRepository } from '../../repositories/transaction-repository'
import { Either, right } from '@/core/either'
import { Transaction } from '@/domain/enterprise/entities/transaction'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface CreateTransactionUseCaseRequest {
  name: string
  type: TransactionType
  category: TransactionCategory
  paymentMethod: TransactionPaymentMethod
  amount: number
  userId: string
  date: Date
}

type CreateTransactionUseCaseResponse = Either<
  null,
  {
    transaction: Transaction
  }
>

export class CreateTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    name,
    type,
    category,
    paymentMethod,
    amount,
    userId,
    date,
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const transaction = Transaction.create({
      name,
      type,
      category,
      paymentMethod,
      amount,
      userId: new UniqueEntityId(userId),
      date,
    })

    await this.transactionRepository.create(transaction)

    return right({
      transaction,
    })
  }
}
