import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { GetDashboardDataUseCase } from './get-dashboard-data'
import { makeTransaction } from 'test/factories/make-transaction'
import { TransactionType } from '@/core/@types/enums'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let sut: GetDashboardDataUseCase

describe('Get Dashboard Data', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    sut = new GetDashboardDataUseCase(inMemoryTransactionRepository)
  })

  it('should be able to get dashboard data', async () => {
    const transaction = makeTransaction()
    const transaction2 = makeTransaction({
      type: TransactionType.INVESTMENT,
    })
    const transaction3 = makeTransaction({
      type: TransactionType.EXPENSE,
    })
    const transaction4 = makeTransaction({
      type: TransactionType.DEPOSIT,
    })

    await inMemoryTransactionRepository.create(transaction)
    await inMemoryTransactionRepository.create(transaction2)
    await inMemoryTransactionRepository.create(transaction3)
    await inMemoryTransactionRepository.create(transaction4)

    const dashboardData = await sut.execute({
      userId: transaction.userId.toString(),
      month: new Date().getMonth().toString(),
      year: new Date().getFullYear().toString(),
    })

    expect(dashboardData.isRight()).toBe(true)
    expect(dashboardData.value).toEqual(
      expect.objectContaining({
        depositTotal: expect.any(Number),
        investmentTotal: expect.any(Number),
      }),
    )
  })

  it('should not be able to get dashboard data with invalid userId', async () => {
    const transaction = makeTransaction()

    await inMemoryTransactionRepository.create(transaction)

    const dashboardData = await sut.execute({
      userId: 'invalid-user-id',
      month: new Date().getMonth().toString(),
      year: new Date().getFullYear().toString(),
    })

    expect(dashboardData.isLeft()).toBe(true)
    expect(dashboardData.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
