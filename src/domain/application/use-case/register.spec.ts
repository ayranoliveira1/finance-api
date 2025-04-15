import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { RegisterUseCase } from './register'
import { FakerHasher } from 'test/cryptography/faker-hasher'
import { makeUser } from 'test/factories/make-user'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let inMemoryUserRepository: InMemoryUserRepository
let fakerHash: FakerHasher
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakerHash = new FakerHasher()
    sut = new RegisterUseCase(inMemoryUserRepository, fakerHash)
  })

  it('should be able to register a user', async () => {
    const user = makeUser()

    const result = await sut.execute(user)

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUserRepository.items[0],
    })
  })

  it('should hash user password upon registration', async () => {
    const user = makeUser({
      password: 'any_password',
    })

    await sut.execute(user)

    const result = await sut.execute(user)

    const hashedPassword = await fakerHash.hash('any_password')

    expect(result.isLeft()).toBe(true)
    expect(inMemoryUserRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not allow duplicate user registration', async () => {
    const user = makeUser()

    await sut.execute(user)

    const result = await sut.execute(user)

    expect(result.isLeft()).toBe(true)
    expect(inMemoryUserRepository.items.length).toBe(1)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
