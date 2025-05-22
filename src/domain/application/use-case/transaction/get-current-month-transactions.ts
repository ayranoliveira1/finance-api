import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '../../repositories/transaction-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { Transaction } from '@/domain/enterprise/entities/transaction'

interface GetCurrentMonthTransactionsUseCaseRequest {
  userId: string
  start: Date
  end: Date
}

type GetCurrentMonthTransactionsUseCaseResponse = Either<
  ResourceNotFoundError,
  Transaction[]
>

@Injectable()
export class GetCurrentMonthTransactionsUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    userId,
    start,
    end,
  }: GetCurrentMonthTransactionsUseCaseRequest): Promise<GetCurrentMonthTransactionsUseCaseResponse> {
    const transactions =
      await this.transactionRepository.getCurrentMonthTransactions(
        userId,
        start,
        end,
      )

    if (!transactions) {
      return left(new ResourceNotFoundError())
    }

    return right(transactions)
  }
}
