import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { CreateTransactionUseCase } from './create-transaction'
import { makeTransaction } from 'test/factories/make-transaction'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let sut: CreateTransactionUseCase

describe('Create Transaction Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    sut = new CreateTransactionUseCase(inMemoryTransactionRepository)
  })

  it('should be able to create a transaction', async () => {
    const transaction = makeTransaction()

    const result = await sut.execute({
      name: transaction.name,
      type: transaction.type,
      category: transaction.category,
      paymentMethod: transaction.paymentMethod,
      amount: transaction.amount,
      userId: transaction.userId.toString(),
      date: transaction.date,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      transaction: inMemoryTransactionRepository.items[0],
    })
  })
})
