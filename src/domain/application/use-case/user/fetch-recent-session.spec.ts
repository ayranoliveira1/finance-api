import { InMemorySessionRepository } from 'test/repositories/in-memory-session-repository'
import { FetchRecentSessionUseCase } from './fetch-recent-session'
import { makeSession } from 'test/factories/make-session'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { FakerEncryption } from 'test/cryptography/faker-encryption'

let inMemorySessionRepository: InMemorySessionRepository
let fakerEncryption: FakerEncryption
let sut: FetchRecentSessionUseCase

describe('Fetch Recent Session Use Case', () => {
  beforeEach(() => {
    inMemorySessionRepository = new InMemorySessionRepository()
    fakerEncryption = new FakerEncryption()
    sut = new FetchRecentSessionUseCase(
      inMemorySessionRepository,
      fakerEncryption,
    )
  })

  it('should be able to fetch recent session', async () => {
    const session = makeSession({
      ip: await fakerEncryption.encrypt('192.168.0.1'),
      browser: await fakerEncryption.encrypt('Chrome'),
      os: await fakerEncryption.encrypt('Windows'),
      deviceType: await fakerEncryption.encrypt('Desktop'),
      country: await fakerEncryption.encrypt('USA'),
      city: await fakerEncryption.encrypt('New York'),
      region: await fakerEncryption.encrypt('NY'),
    })

    await inMemorySessionRepository.create(session)

    const result = await sut.execute({
      userId: session.userId,
    })

    console.log(result.value)

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      session: expect.objectContaining({
        ip: '192.168.0.1',
        browser: 'Chrome',
        os: 'Windows',
        deviceType: 'Desktop',
        country: 'USA',
        city: 'New York',
        region: 'NY',
      }),
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
