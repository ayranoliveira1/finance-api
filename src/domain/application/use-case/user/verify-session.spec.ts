import { InMemorySessionRepository } from 'test/repositories/in-memory-session-repository'
import { VerifySessionUseCase } from './verify-session'
import { makeSession } from 'test/factories/make-session'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

let inMemorySessionRepository: InMemorySessionRepository
let sut: VerifySessionUseCase

describe('VerifySessionUseCase', () => {
  beforeEach(() => {
    inMemorySessionRepository = new InMemorySessionRepository()
    sut = new VerifySessionUseCase(inMemorySessionRepository)
  })

  it('should be able to verify a session', async () => {
    const session = makeSession()

    await inMemorySessionRepository.create(session)

    const result = await sut.execute({
      sessionId: session.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      session: inMemorySessionRepository.items[0],
    })
  })

  it('should not be able to verify a session if it does not exist', async () => {
    const session = makeSession()

    await inMemorySessionRepository.create(session)

    const result = await sut.execute({
      sessionId: 'non-existing-session-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
