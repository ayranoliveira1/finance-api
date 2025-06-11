import { InMemorySessionRepository } from 'test/repositories/in-memory-session-repository'
import { FetchRecentSessionUseCase } from './fetch-recent-session'
import { makeSession } from 'test/factories/make-session'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'

let inMemorySessionRepository: InMemorySessionRepository
let sut: FetchRecentSessionUseCase

describe('Fetch Recent Session Use Case', () => {
  beforeEach(() => {
    inMemorySessionRepository = new InMemorySessionRepository()
    sut = new FetchRecentSessionUseCase(inMemorySessionRepository)
  })

  it('should be able to fetch recent session', async () => {
    const session = makeSession()

    await inMemorySessionRepository.create(session)

    const result = await sut.execute({
      userId: session.userId,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      session: inMemorySessionRepository.items[0],
    })
  })

  it('should not be able to fetch recent session if it does not exist', async () => {
    const session = makeSession()

    await inMemorySessionRepository.create(session)

    const result = await sut.execute({
      userId: 'non-existing-user',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
