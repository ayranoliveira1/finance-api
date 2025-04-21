import { NotAllowedError } from '@/core/@types/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '../../repositories/transaction-repository'

interface DeleteTransactionUseCaseRequest {
  transactionId: string
  userId: string
}

type DeleteTransactionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    transactionId,
    userId,
  }: DeleteTransactionUseCaseRequest): Promise<DeleteTransactionUseCaseResponse> {
    const transaction = await this.transactionRepository.findById(transactionId)

    if (!transaction) {
      return left(new ResourceNotFoundError())
    }

    if (transaction.userId.toString() !== userId) {
      return left(new NotAllowedError())
    }

    await this.transactionRepository.delete(transaction)

    return right(null)
  }
}
