import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { DeleteTransactionUseCase } from './delete-transaction'
import { makeTransaction } from 'test/factories/make-transaction'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let sut: DeleteTransactionUseCase

describe('Delete Transaction Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    sut = new DeleteTransactionUseCase(inMemoryTransactionRepository)
  })

  it('should be able to delete a transaction', async () => {
    const transaction = makeTransaction()

    inMemoryTransactionRepository.create(transaction)

    const result = await sut.execute({
      transactionId: transaction.id.toString(),
      userId: transaction.userId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTransactionRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a transaction that does not exist', async () => {
    const transaction = makeTransaction()

    inMemoryTransactionRepository.create(transaction)

    const result = await sut.execute({
      transactionId: 'non-existing-transaction-id',
      userId: transaction.userId.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryTransactionRepository.items).toHaveLength(1)
  })

  it('should not be able to delete a transaction that does not belong to the user', async () => {
    const transaction = makeTransaction()

    inMemoryTransactionRepository.create(transaction)

    const result = await sut.execute({
      transactionId: transaction.id.toString(),
      userId: 'non-existing-user-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryTransactionRepository.items).toHaveLength(1)
  })
})
