import { Transaction } from '@/domain/enterprise/entities/transaction'

export class TransactionPresenter {
  static toHttp(transaction: Transaction) {
    return {
      id: transaction.id.toString(),
      name: transaction.name,
      date: transaction.date,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      paymentMethod: transaction.paymentMethod,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }
  }
}
