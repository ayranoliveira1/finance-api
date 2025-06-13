import { SessionRepository } from '@/domain/application/repositories/session-repository'
import { Session } from '@/domain/enterprise/entities/session'

export class InMemorySessionRepository implements SessionRepository {
  public items: Session[] = []

  async findById(id: string) {
    const session = this.items.find((session) => session.id.toString() === id)

    if (!session) return null

    return session
  }

  async findByUserId(userId: string) {
    const session = this.items.find((session) => session.userId === userId)

    if (!session) return null

    return session
  }

  async findManyRecent(userId: string) {
    const recentSession = this.items
      .filter((session) => session.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
    if (!recentSession) return null

    return recentSession
  }

  async create(session: Session) {
    this.items.push(session)
  }

  async delete(session: Session) {
    const index = this.items.findIndex((item) => item.id === session.id)

    this.items.splice(index, 1)
  }
}
