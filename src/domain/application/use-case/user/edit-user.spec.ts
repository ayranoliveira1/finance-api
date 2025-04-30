import { FakerHasher } from 'test/cryptography/faker-hasher'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { EditUserUseCase } from './edit-user'
import { makeUser } from 'test/factories/make-user'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'

let inMemoryUserRepository: InMemoryUserRepository
let fakerHash: FakerHasher
let sut: EditUserUseCase

describe('Edit User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakerHash = new FakerHasher()
    sut = new EditUserUseCase(inMemoryUserRepository, fakerHash, fakerHash)
  })

  it('should be able to edit name a user', async () => {
    const user = makeUser({})

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      name: 'new_name',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0].name).toBe('new_name')
  })

  it('should be able to edit email a user', async () => {
    const user = makeUser({})

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      email: 'test1@gmail.com',
    })

    console.log(result)

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0].email).toBe('test1@gmail.com')
  })

  it('should not allow editing to an email exist', async () => {
    const user = makeUser({})
    await inMemoryUserRepository.create(user)

    const user2 = makeUser({
      email: 'test2@gmail.com',
    })
    await inMemoryUserRepository.create(user2)

    const result = await sut.execute({
      userId: user.id.toString(),
      email: 'test2@gmail.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to edit password a user', async () => {
    const user = makeUser({
      password: await fakerHash.hash('any_password'),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      confirmPassword: 'any_password',
      newPassword: 'new_password',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0].password).not.toBe('new_password')
  })

  it('should not allow editing password with wrong password', async () => {
    const user = makeUser({
      password: await fakerHash.hash('any_password'),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      confirmPassword: 'wrong_password',
      newPassword: 'new_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not allow editing password without confirmPassword', async () => {
    const user = makeUser({
      password: await fakerHash.hash('any_password'),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      newPassword: 'new_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not allow editing password without newPassword', async () => {
    const user = makeUser({
      password: await fakerHash.hash('any_password'),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      confirmPassword: 'any_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not allow editing user with wrong id', async () => {
    const user = makeUser({
      password: await fakerHash.hash('any_password'),
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: 'wrong_id',
      confirmPassword: 'any_password',
      newPassword: 'new_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
