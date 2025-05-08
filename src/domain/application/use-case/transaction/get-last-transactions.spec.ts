import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { makeTransaction } from 'test/factories/make-transaction'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { GetLastTransactionsUseCase } from './get-last-transactions'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let sut: GetLastTransactionsUseCase

describe('Get Last Transactions', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    sut = new GetLastTransactionsUseCase(inMemoryTransactionRepository)
  })

  it('should be able to get last transactions', async () => {
    const transaction = makeTransaction()

    for (let i = 0; i < 10; i++) {
      await inMemoryTransactionRepository.create(transaction)
    }

    const result = await sut.execute({
      userId: transaction.userId.toString(),
      month: new Date().getMonth().toString(),
      year: new Date().getFullYear().toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveLength(5)
  })

  it('should return ResourceNotFoundError for non-existing user', async () => {
    const transaction = makeTransaction()

    for (let i = 0; i < 10; i++) {
      await inMemoryTransactionRepository.create(transaction)
    }

    const result = await sut.execute({
      userId: 'non-existing-user-id',
      month: new Date().getMonth().toString(),
      year: new Date().getFullYear().toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
