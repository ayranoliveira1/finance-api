import { Transaction } from '@/domain/enterprise/entities/transaction'

export interface TransactionPagination {
  transactions: Transaction[]
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
}
