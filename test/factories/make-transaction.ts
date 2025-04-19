import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from '@/core/@types/enums'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Transaction,
  TransactionProps,
} from '@/domain/enterprise/entities/transaction'

import { faker } from '@faker-js/faker'

export function makeTransaction(
  overrides: Partial<TransactionProps> = {},
  id?: UniqueEntityId,
) {
  const transaction = Transaction.create(
    {
      name: faker.person.fullName(),
      amount: faker.number.int(),
      category: TransactionCategory.FOOD,
      type: TransactionType.EXPENSE,
      paymentMethod: TransactionPaymentMethod.CREDIT_CARD,
      userId: new UniqueEntityId(),
      date: faker.date.anytime(),
      ...overrides,
    },
    id,
  )

  return transaction
}
