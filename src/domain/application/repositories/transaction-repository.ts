import { DashboardData } from '@/core/repositories/dashboard-data'
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
  abstract getCurrentMonthTransactionsCount(
    userId: string,
    start: Date,
    end: Date,
  ): Promise<number | null>
  abstract getCurrentMonthTransactions(
    userId: string,
    month: string,
    year: string,
  ): Promise<Transaction[] | null>
  abstract getLastTransactions(
    userId: string,
    month: string,
    year: string,
  ): Promise<Transaction[] | null>
  abstract getDashboard(
    userId: string,
    month: string,
    year: string,
  ): Promise<DashboardData | null>
  abstract save(transaction: Transaction): Promise<void>
  abstract create(transaction: Transaction): Promise<void>
  abstract delete(transaction: Transaction): Promise<void>
}
