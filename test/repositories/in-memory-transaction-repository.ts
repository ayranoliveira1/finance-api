import { PaginationParms } from '@/core/repositories/pagination-params'
import { TransactionRepository } from '@/domain/application/repositories/transaction-repository'
import { Transaction } from '@/domain/enterprise/entities/transaction'

export class InMemoryTransactionRepository implements TransactionRepository {
  public items: Transaction[] = []

  async findById(id: string) {
    const transaction = this.items.find((item) => item.id.toString() === id)

    if (!transaction) {
      return null
    }

    return transaction
  }

  async create(transaction: Transaction) {
    this.items.push(transaction)
  }

  async delete(transaction: Transaction) {
    const index = this.items.findIndex((item) => item.id === transaction.id)

    this.items.splice(index, 1)
  }

  async findManyRecents(
    userId: string,
    params: PaginationParms,
    search?: string,
  ) {
    const { page } = params

    const filteredItems = this.items.filter((item) => {
      if (search) {
        return (
          item.userId.toString() === userId &&
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      }

      return item.userId.toString() === userId
    })

    const paginatedTransactions = filteredItems
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return {
      transactions: paginatedTransactions,
      totalItems: filteredItems.length,
      totalPages: Math.ceil(filteredItems.length / 20),
      currentPage: page,
      pageSize: 20,
    }
  }
}
