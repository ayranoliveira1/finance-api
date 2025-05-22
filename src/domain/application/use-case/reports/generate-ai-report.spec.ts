import { FakerReports } from 'test/reports/faker-reports'
import { InMemoryTransactionRepository } from 'test/repositories/in-memory-transaction-repository'
import { GenerateAIReportUseCase } from './generate-ai-report'
import { makeTransaction } from 'test/factories/make-transaction'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'

let inMemoryTransactionRepository: InMemoryTransactionRepository
let fakerReport: FakerReports
let sut: GenerateAIReportUseCase

describe('GenerateAIReportUseCase', () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository()
    fakerReport = new FakerReports()
    sut = new GenerateAIReportUseCase(
      fakerReport,
      inMemoryTransactionRepository,
    )
  })

  it('should be able to generate a report', async () => {
    const transaction = makeTransaction({
      date: new Date('2025-05-27'),
    })

    for (let i = 0; i < 5; i++) {
      await inMemoryTransactionRepository.create(transaction)
    }

    const response = await sut.execute({
      userId: transaction.userId.toString(),
      month: transaction.date.getMonth().toString(),
      year: transaction.date.getFullYear().toString(),
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual(expect.any(String))
  })

  it('should not be able to generate a report if the user does not exist', async () => {
    const transaction = makeTransaction({
      date: new Date('2025-05-27'),
    })

    for (let i = 0; i < 5; i++) {
      await inMemoryTransactionRepository.create(transaction)
    }

    const response = await sut.execute({
      userId: 'non-existing-user-id',
      month: transaction.date.getMonth().toString(),
      year: transaction.date.getFullYear().toString(),
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
