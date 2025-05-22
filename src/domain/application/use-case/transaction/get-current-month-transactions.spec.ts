import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { makeTransaction } from 'test/factories/make-transaction'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { GetCurrentMonthTransactionsUseCase } from './get-current-month-transactions'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let sut: GetCurrentMonthTransactionsUseCase

describe('GetCurrentMonthTransactionsUseCase', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    sut = new GetCurrentMonthTransactionsUseCase(inMemoryTransactionRepository)
  })

  it('should be able to get the current month transactions', async () => {
    const transaction = makeTransaction()

    for (let i = 0; i < 10; i++) {
      await inMemoryTransactionRepository.create(transaction)
    }

    const result = await sut.execute({
      userId: transaction.userId.toString(),
      month: String(new Date().getMonth()),
      year: String(new Date().getFullYear()),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTransactionRepository.items).toEqual(
      expect.arrayContaining([expect.objectContaining(transaction)]),
    )
    expect(inMemoryTransactionRepository.items.length).toBe(10)
  })

  it('should be not able to get the current month transactions', async () => {
    const transaction = makeTransaction()

    for (let i = 0; i < 10; i++) {
      await inMemoryTransactionRepository.create(transaction)
    }

    const result = await sut.execute({
      userId: 'non-existing-user-id',
      month: String(new Date().getMonth()),
      year: String(new Date().getFullYear()),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
