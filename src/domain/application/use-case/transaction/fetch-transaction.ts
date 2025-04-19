import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '../../repositories/transaction-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { TransactionPagination } from '@/core/repositories/transaction-pagination'

interface FetchTransactionUseCaseRequest {
  page?: number
  userId: string
  search?: string
}

type FetchTransactionUseCaseResponse = Either<
  ResourceNotFoundError,
  TransactionPagination
>

@Injectable()
export class FetchTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    page,
    userId,
    search,
  }: FetchTransactionUseCaseRequest): Promise<FetchTransactionUseCaseResponse> {
    const result = await this.transactionRepository.findManyRecents(
      userId,
      { page: page ?? 1 },
      search,
    )

    if (!result) {
      return left(new ResourceNotFoundError())
    }

    return right(result)
  }
}
