import { PaginationParms } from '@/core/repositories/pagination-params'
import { TransactionPagination } from '@/core/repositories/transaction-pagination'
import { Transaction } from '@/domain/enterprise/entities/transaction'

export abstract class TransactionRepository {
  abstract findById(id: string): Promise<Transaction | null>
  abstract findManyRecents(
    userId: string,
    params?: PaginationParms,
    search?: string,
  ): Promise<TransactionPagination | null>
  abstract create(transaction: Transaction): Promise<void>
  abstract delete(transaction: Transaction): Promise<void>
}
