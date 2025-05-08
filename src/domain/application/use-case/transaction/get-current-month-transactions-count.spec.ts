import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { GetCurrentMonthTransactionsCountUseCase } from './get-current-month-transactions-count'
import { endOfMonth, startOfMonth } from 'date-fns'
import { makeTransaction } from 'test/factories/make-transaction'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let sut: GetCurrentMonthTransactionsCountUseCase

describe('GetCurrentMonthTransactionsCountUseCase', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    sut = new GetCurrentMonthTransactionsCountUseCase(
      inMemoryTransactionRepository,
    )
  })

  it('should be able to get the current month transactions count', async () => {
    const start = startOfMonth(new Date())
    const end = endOfMonth(new Date())

    const transaction = makeTransaction()

    for (let i = 0; i < 10; i++) {
      await inMemoryTransactionRepository.create(transaction)
    }

    const result = await sut.execute({
      userId: transaction.userId.toString(),
      start,
      end,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        count: 10,
      }),
    )
  })

  it('should be not able to get the current month transactions count', async () => {
    const start = startOfMonth(new Date())
    const end = endOfMonth(new Date())

    const transaction = makeTransaction()

    for (let i = 0; i < 10; i++) {
      await inMemoryTransactionRepository.create(transaction)
    }

    const result = await sut.execute({
      userId: 'non-existing-user-id',
      start,
      end,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
