import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { EditTransactionUseCase } from './edit-transaction'
import { makeTransaction } from 'test/factories/make-transaction'
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from '@/core/@types/enums'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let sut: EditTransactionUseCase

describe('Edit Transaction Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    sut = new EditTransactionUseCase(inMemoryTransactionRepository)
  })

  it('should be able to edit a transaction', async () => {
    const transaction = makeTransaction({
      userId: new UniqueEntityId('user-1'),
    })

    inMemoryTransactionRepository.create(transaction)

    const result = await sut.execute({
      TransactionId: transaction.id.toString(),
      name: 'New Transaction',
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
      paymentMethod: TransactionPaymentMethod.CREDIT_CARD,
      amount: 500,
      userId: 'user-1',
      date: new Date(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTransactionRepository.items[0].name).toBe('New Transaction')
  })

  it('should not be able to edit a transaction if it does not exist', async () => {
    const transaction = makeTransaction()

    inMemoryTransactionRepository.create(transaction)

    const result = await sut.execute({
      TransactionId: 'non-existing-transaction-id',
      name: 'New Transaction',
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
      paymentMethod: TransactionPaymentMethod.CREDIT_CARD,
      amount: 500,
      userId: 'user-1',
      date: new Date(),
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryTransactionRepository.items[0].name).toBe(transaction.name)
  })

  it('should not be able to edit a transaction if the user is not the owner', async () => {
    const transaction = makeTransaction({
      userId: new UniqueEntityId('user-1'),
    })

    inMemoryTransactionRepository.create(transaction)

    const result = await sut.execute({
      TransactionId: transaction.id.toString(),
      name: 'New Transaction',
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
      paymentMethod: TransactionPaymentMethod.CREDIT_CARD,
      amount: 500,
      userId: 'user-2',
      date: new Date(),
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryTransactionRepository.items[0].name).toBe(transaction.name)
  })
})
