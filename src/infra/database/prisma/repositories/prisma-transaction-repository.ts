import { TransactionRepository } from '@/domain/application/repositories/transaction-repository'
import { Injectable } from '@nestjs/common'
import { PrismaTransactionMapper } from '../mappers/prisma-transaction-mapper'
import { Transaction } from '@/domain/enterprise/entities/transaction'
import { PrismaService } from '../prisma.service'
import { PaginationParms } from '@/core/repositories/pagination-params'
import { DashboardData } from '@/core/repositories/dashboard-data'
import { TransactionPercentagePerType } from '@/core/@types/transaction-percentage-per-type'
import { TransactionType } from '@/core/@types/enums'
import { TotalExpensePerCategory } from '../@types/total-expense-per-category'

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id,
      },
    })

    if (!transaction) {
      return null
    }

    return PrismaTransactionMapper.toDomain(transaction)
  }

  async findManyRecents(
    userId: string,
    { page }: PaginationParms,
    search?: string,
  ) {
    const pageSize = 10
    const currentPage = page && page > 0 ? page : 1
    const skip = (currentPage - 1) * pageSize

    const where: Record<string, unknown> = {
      userId,
    }

    if (search) {
      where.OR = [{ name: { contains: search, mode: 'insensitive' } }]
    }

    const [transactions, totalItems] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ])

    if (!transactions) {
      return null
    }

    const totalPages = Math.ceil(totalItems / pageSize)

    return {
      transactions: transactions.map(PrismaTransactionMapper.toDomain),
      totalItems,
      totalPages,
      currentPage,
      pageSize,
    }
  }

  async getCurrentMonthTransactionsCount(
    userId: string,
    start: Date,
    end: Date,
  ): Promise<number | null> {
    const transactions = await this.prisma.transaction.count({
      where: {
        userId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    })

    if (!transactions) {
      return 0
    }

    return transactions
  }

  async getCurrentMonthTransactions(
    userId: string,
    month: string,
    year: string,
  ) {
    const start = new Date(`${year}-${month}-01T00:00:00Z`)
    const end = new Date(
      new Date(`${year}-${month}-01`).setMonth(Number(month)),
    ).toISOString()

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        createdAt: {
          gte: start,
          lte: new Date(end),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!transactions) {
      return null
    }

    return transactions.map(PrismaTransactionMapper.toDomain)
  }

  async getLastTransactions(userId: string, month: string, year: string) {
    const start = new Date(`${year}-${month}-01T00:00:00Z`)
    const end = new Date(
      new Date(`${year}-${month}-01`).setMonth(Number(month)),
    ).toISOString()

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        createdAt: {
          gte: start,
          lte: new Date(end),
        },
      },
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!transactions) {
      return null
    }

    return transactions.map(PrismaTransactionMapper.toDomain)
  }

  async getDashboard(
    userId: string,
    month: string,
    year: string,
  ): Promise<DashboardData | null> {
    const start = new Date(`${year}-${month}-01T00:00:00Z`)
    const end = new Date(
      new Date(`${year}-${month}-01`).setMonth(Number(month)),
    ).toISOString()

    const where = {
      userId,
      date: {
        gte: start,
        lt: new Date(end),
      },
    }

    const depositTotal = (
      await this.prisma.transaction.aggregate({
        where: { ...where, type: 'DEPOSIT' },
        _sum: { amount: true },
      })
    )._sum.amount

    const investmentTotal = (
      await this.prisma.transaction.aggregate({
        where: { ...where, type: 'INVESTMENT' },
        _sum: { amount: true },
      })
    )._sum.amount

    const expensesTotal = (
      await this.prisma.transaction.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true },
      })
    )._sum.amount

    const balanc =
      Number(depositTotal) - Number(investmentTotal) - Number(expensesTotal)

    const transactionsTotal = Number(
      (
        await this.prisma.transaction.aggregate({
          where,
          _sum: { amount: true },
        })
      )._sum.amount,
    )
    const typesPercentage: TransactionPercentagePerType = {
      [TransactionType.DEPOSIT]: Math.round(
        (Number(depositTotal || 0) / Number(transactionsTotal)) * 100,
      ),
      [TransactionType.EXPENSE]: Math.round(
        (Number(expensesTotal || 0) / Number(transactionsTotal)) * 100,
      ),
      [TransactionType.INVESTMENT]: Math.round(
        (Number(investmentTotal || 0) / Number(transactionsTotal)) * 100,
      ),
    }

    const totalExpensePerCategory: TotalExpensePerCategory[] = (
      await this.prisma.transaction.groupBy({
        by: ['category'],
        where: {
          ...where,
          type: TransactionType.EXPENSE,
        },
        _sum: {
          amount: true,
        },
      })
    ).map((category) => ({
      category: category.category,
      totalAmount: Number(category._sum.amount),
      percentageOfTotal: Math.round(
        (Number(category._sum.amount) / Number(expensesTotal)) * 100,
      ),
    }))

    return {
      balanc,
      depositTotal: Number(depositTotal),
      investmentTotal: Number(investmentTotal),
      expensesTotal: Number(expensesTotal),
      typesPercentage,
      totalExpensePerCategory,
    }
  }

  async save(transaction: Transaction) {
    const data = PrismaTransactionMapper.toPrisma(transaction)

    await this.prisma.transaction.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(transaction: Transaction) {
    const data = PrismaTransactionMapper.toPrisma(transaction)

    await this.prisma.transaction.create({
      data,
    })
  }

  async delete(transaction: Transaction) {
    const data = PrismaTransactionMapper.toPrisma(transaction)

    await this.prisma.transaction.delete({
      where: {
        id: data.id,
      },
    })
  }
}
