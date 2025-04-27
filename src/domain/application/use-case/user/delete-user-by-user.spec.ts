import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { DeleteUserByUserUseCase } from './delete-user-by-user'
import { FakerHasher } from 'test/cryptography/faker-hasher'
import { makeUser } from 'test/factories/make-user'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'

let inMemoryUserRepository: InMemoryUserRepository
let fakerHash: FakerHasher
let sut: DeleteUserByUserUseCase

describe('Delete User By User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakerHash = new FakerHasher()
    sut = new DeleteUserByUserUseCase(inMemoryUserRepository, fakerHash)
  })

  it('should be able to delete a user', async () => {
    const user = makeUser({
      password: await fakerHash.hash('any_password'),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      password: 'any_password',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a user with wrong password', async () => {
    const user = makeUser({
      password: await fakerHash.hash('any_password'),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      password: 'wrong_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to delete a non-existing user with correct password', async () => {
    const user = makeUser({
      password: await fakerHash.hash('any_password'),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: 'non-existing-user-id',
      password: 'any_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
