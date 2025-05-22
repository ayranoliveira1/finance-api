import { TransactionCategory, TransactionType } from '@/core/@types/enums'
import { DashboardData } from '@/core/repositories/dashboard-data'
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

  async save(transaction: Transaction) {
    const index = this.items.findIndex((item) => item.id === transaction.id)

    this.items[index] = transaction
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

  async getCurrentMonthTransactionsCount(
    userId: string,
    start: Date,
    end: Date,
  ) {
    const filteredItems = this.items.filter((item) => {
      return (
        item.userId.toString() === userId &&
        item.createdAt >= start &&
        item.createdAt <= end
      )
    })

    if (filteredItems.length === 0) {
      return null
    }

    return filteredItems.length
  }

  async getCurrentMonthTransactions(userId: string, start: Date, end: Date) {
    const filteredItems = this.items.filter((item) => {
      return (
        item.userId.toString() === userId &&
        item.createdAt >= start &&
        item.createdAt <= end
      )
    })

    if (filteredItems.length === 0) {
      return null
    }

    return filteredItems
  }

  async getLastTransactions(userId: string, month: string, year: string) {
    const filteredItems = this.items.filter((item) => {
      return (
        item.userId.toString() === userId &&
        item.createdAt.getMonth() === Number(month) &&
        item.createdAt.getFullYear() === Number(year)
      )
    })

    const sortedItems = filteredItems.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )

    if (sortedItems.length === 0) {
      return null
    }

    return sortedItems.slice(0, 5)
  }

  async getDashboard(
    userId: string,
    month: string,
    year: string,
  ): Promise<DashboardData | null> {
    const filteredItems = this.items.filter((item) => {
      return (
        item.userId.toString() === userId &&
        item.createdAt.getMonth() === Number(month) &&
        item.createdAt.getFullYear() === Number(year)
      )
    })

    if (filteredItems.length === 0) {
      return null
    }

    const depositTotal = filteredItems
      .filter((item) => item.type === TransactionType.DEPOSIT)
      .reduce((acc, item) => acc + item.amount, 0)

    const investmentTotal = filteredItems
      .filter((item) => item.type === TransactionType.INVESTMENT)
      .reduce((acc, item) => acc + item.amount, 0)

    const expensesTotal = filteredItems
      .filter((item) => item.type === TransactionType.EXPENSE)
      .reduce((acc, item) => acc + item.amount, 0)

    const balanc = depositTotal - investmentTotal - expensesTotal

    const typesPercentage = {
      [TransactionType.DEPOSIT]: Math.round(
        (Number(depositTotal || 0) /
          Number(depositTotal + investmentTotal + expensesTotal)) *
          100,
      ),
      [TransactionType.EXPENSE]: Math.round(
        (Number(expensesTotal || 0) /
          Number(depositTotal + investmentTotal + expensesTotal)) *
          100,
      ),
      [TransactionType.INVESTMENT]: Math.round(
        (Number(investmentTotal || 0) /
          Number(depositTotal + investmentTotal + expensesTotal)) *
          100,
      ),
    }

    const totalExpensePerCategory: {
      category: TransactionCategory
      totalAmount: number
      percentageOfTotal: number
    }[] = {
      ...Object.values(TransactionCategory).map((category) => {
        const totalAmount = filteredItems
          .filter(
            (item) =>
              item.type === TransactionType.EXPENSE &&
              item.category === category,
          )
          .reduce((acc, item) => acc + item.amount, 0)

        const percentageOfTotal = (totalAmount / expensesTotal) * 100 || 0

        return {
          category,
          totalAmount,
          percentageOfTotal,
        }
      }),
    }

    return {
      balanc,
      depositTotal,
      investmentTotal,
      expensesTotal,
      typesPercentage,
      totalExpensePerCategory,
    }
  }
}
