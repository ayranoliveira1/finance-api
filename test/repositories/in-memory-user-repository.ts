import { UserRepository } from '@/domain/application/repositories/user-repository'
import { User } from '@/domain/enterprise/entities/user'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string) {
    const user = this.items.find((user) => user.id.toString() === id)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: User) {
    this.items.push(user)
  }

  async delete(user: User) {
    const userIndex = this.items.findIndex((item) => item.id === user.id)

    this.items.splice(userIndex, 1)
  }
}
