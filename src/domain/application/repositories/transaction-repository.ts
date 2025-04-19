import { Transaction } from '@/domain/enterprise/entities/transaction'

export abstract class TransactionRepository {
  abstract findById(id: string): Promise<Transaction | null>
  abstract create(transaction: Transaction): Promise<void>
  abstract delete(transaction: Transaction): Promise<void>
}
