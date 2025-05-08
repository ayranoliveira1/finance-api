import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '../../repositories/transaction-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'

interface GetCurrentMonthTransactionsCountUseCaseRequest {
  userId: string
  start: Date
  end: Date
}

type GetCurrentMonthTransactionsCountUseCaseResponse = Either<
  ResourceNotFoundError,
  { count: number }
>

@Injectable()
export class GetCurrentMonthTransactionsCountUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    userId,
    start,
    end,
  }: GetCurrentMonthTransactionsCountUseCaseRequest): Promise<GetCurrentMonthTransactionsCountUseCaseResponse> {
    const result =
      await this.transactionRepository.getCurrentMonthTransactionsCount(
        userId,
        start,
        end,
      )

    if (!result) {
      return left(new ResourceNotFoundError())
    }

    return right({ count: result })
  }
}
