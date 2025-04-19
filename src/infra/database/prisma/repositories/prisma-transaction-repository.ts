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
    const pageSize = 12
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
