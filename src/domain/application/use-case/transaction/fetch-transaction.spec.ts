import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { CreateTransactionUseCase } from './create-transaction'
import { makeTransaction } from 'test/factories/make-transaction'
import { FetchTransactionUseCase } from './fetch-transaction'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let createTransactionUseCase: CreateTransactionUseCase
let sut: FetchTransactionUseCase

describe('Fetch Transaction Use Case', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    createTransactionUseCase = new CreateTransactionUseCase(
      inMemoryTransactionRepository,
    )
    sut = new FetchTransactionUseCase(inMemoryTransactionRepository)
  })

  it('should be able to get a transaction', async () => {
    const transaction = makeTransaction()

    await createTransactionUseCase.execute({
      name: transaction.name,
      type: transaction.type,
      category: transaction.category,
      paymentMethod: transaction.paymentMethod,
      amount: transaction.amount,
      userId: transaction.userId.toString(),
      date: transaction.date,
    })

    const result = await sut.execute({
      userId: transaction.userId.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        transactions: expect.arrayContaining([
          expect.objectContaining({ userId: transaction.userId }),
        ]),
      }),
    )
  })

  it('should be able to get a transaction with search', async () => {
    const transaction = makeTransaction({ name: 'test' })

    await createTransactionUseCase.execute({
      name: transaction.name,
      type: transaction.type,
      category: transaction.category,
      paymentMethod: transaction.paymentMethod,
      amount: transaction.amount,
      userId: transaction.userId.toString(),
      date: transaction.date,
    })

    const result = await sut.execute({
      userId: transaction.userId.toString(),
      page: 1,
      search: 'test',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        transactions: expect.arrayContaining([
          expect.objectContaining({ name: transaction.name }),
        ]),
      }),
    )
  })

  it('should be able to get a transaction with pagination', async () => {
    const transaction = makeTransaction()

    for (let i = 0; i < 22; i++) {
      await createTransactionUseCase.execute({
        name: transaction.name,
        type: transaction.type,
        category: transaction.category,
        paymentMethod: transaction.paymentMethod,
        amount: transaction.amount,
        userId: transaction.userId.toString(),
        date: transaction.date,
      })
    }

    const result = await sut.execute({
      userId: transaction.userId.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        transactions: expect.arrayContaining([
          expect.objectContaining({ userId: transaction.userId }),
        ]),
        totalPages: 2,
        totalItems: 22,
        currentPage: 2,
      }),
    )
  })
})
