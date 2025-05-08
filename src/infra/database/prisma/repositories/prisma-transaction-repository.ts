import { TransactionRepository } from '@/domain/application/repositories/transaction-repository'
import { Injectable } from '@nestjs/common'
import { PrismaTransactionMapper } from '../mappers/prisma-transaction-mapper'
import { Transaction } from '@/domain/enterprise/entities/transaction'
import { PrismaService } from '../prisma.service'
import { PaginationParms } from '@/core/repositories/pagination-params'

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
  ): Promise<number> {
    const transactions = await this.prisma.transaction.count({
      where: {
        userId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    })

    return transactions
  }

  async getLastTransactions(userId: string, month: string, year: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(`${year}-${month}-01`),
          lte: new Date(`${year}-${month}-31`),
        },
      },
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!transactions || transactions.length === 0) {
      return null
    }

    return transactions.map(PrismaTransactionMapper.toDomain)
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
