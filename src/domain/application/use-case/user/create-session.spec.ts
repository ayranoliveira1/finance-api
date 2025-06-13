import { FakerLocation } from 'test/location/faker-location'
import { InMemorySessionRepository } from 'test/repositories/in-memory-session-repository'
import { CreateSessionUseCase } from './create-session'
import { makeSession } from 'test/factories/make-session'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { FakerEncryption } from 'test/cryptography/faker-encryption'

let fakerLocation: FakerLocation
let inMemorySessionRepository: InMemorySessionRepository
let fakerEncryption: FakerEncryption
let sut: CreateSessionUseCase

describe('CreateSessionUseCase', () => {
  beforeEach(() => {
    fakerLocation = new FakerLocation()
    inMemorySessionRepository = new InMemorySessionRepository()
    fakerEncryption = new FakerEncryption()
    sut = new CreateSessionUseCase(
      inMemorySessionRepository,
      fakerLocation,
      fakerEncryption,
    )
  })

  it('should be able to create a session', async () => {
    const session = makeSession()

    const result = await sut.execute({
      ip: session.ip,
      browser: session.browser,
      deviceType: session.deviceType,
      os: session.os,
      userId: session.userId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      session: inMemorySessionRepository.items[0],
    })
  })

  it('should not be able to create a session if the location is not found', async () => {
    const session = makeSession({
      ip: '',
      browser: 'Chrome',
      userId: 'user-1',
    })

    const result = await sut.execute({
      ip: session.ip,
      browser: session.browser,
      deviceType: session.deviceType,
      os: session.os,
      userId: session.userId.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
