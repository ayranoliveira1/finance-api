import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from '@/core/@types/enums'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Transaction } from '@/domain/enterprise/entities/transaction'
import {
  Transaction as TransactionPrimsa,
  Prisma,
  $Enums,
} from '@prisma/client'

export class PrismaTransactionMapper {
  static toDomain(raw: TransactionPrimsa): Transaction {
    return Transaction.create(
      {
        name: raw.name,
        category: raw.category as unknown as TransactionCategory,
        paymentMethod: raw.paymentMethod as unknown as TransactionPaymentMethod,
        amount: parseFloat(raw.amount.toFixed(2)),
        type: raw.type as unknown as TransactionType,
        date: raw.date,
        userId: new UniqueEntityId(raw.userId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    transaction: Transaction,
  ): Prisma.TransactionUncheckedCreateInput {
    return {
      id: transaction.id.toString(),
      name: transaction.name,
      type: transaction.type as unknown as $Enums.TransactionType,
      amount: transaction.amount,
      category: transaction.category as unknown as $Enums.TransactionCategory,
      paymentMethod:
        transaction.paymentMethod as unknown as $Enums.TransactionPaymentMethod,
      date: transaction.date,
      userId: transaction.userId.toString(),
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }
  }
}
