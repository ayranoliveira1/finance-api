import { TransactionRepository } from '@/domain/application/repositories/transaction-repository'
import { Transaction } from '@/domain/enterprise/entities/transaction'

export class InMemoryTransactionRepository implements TransactionRepository {
  public items: Transaction[] = []

  async findById(id: string): Promise<Transaction | null> {
    const transaction = this.items.find((item) => item.id.toString() === id)

    if (!transaction) {
      return null
    }

    return transaction
  }

  async create(transaction: Transaction): Promise<void> {
    this.items.push(transaction)
  }

  async delete(transaction: Transaction): Promise<void> {
    const index = this.items.findIndex((item) => item.id === transaction.id)

    this.items.splice(index, 1)
  }
}
