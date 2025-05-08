import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '../../repositories/transaction-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { Transaction } from '@/domain/enterprise/entities/transaction'

interface GetLastTransactionsUseCaseRequest {
  userId: string
  month: string
  year: string
}

type GetLastTransactionsUseCaseResponse = Either<
  ResourceNotFoundError,
  Transaction[]
>

@Injectable()
export class GetLastTransactionsUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    userId,
    month,
    year,
  }: GetLastTransactionsUseCaseRequest): Promise<GetLastTransactionsUseCaseResponse> {
    const result = await this.transactionRepository.getLastTransactions(
      userId,
      month,
      year,
    )

    if (!result) {
      return left(new ResourceNotFoundError())
    }

    return right(result)
  }
}
