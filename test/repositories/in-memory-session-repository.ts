import { SessionRepository } from '@/domain/application/repositories/session-repository'
import { Session } from '@/domain/enterprise/entities/session'

export class InMemorySessionRepository implements SessionRepository {
  public items: Session[] = []

  async create(session: Session) {
    this.items.push(session)
  }

  async findManyRecent(): Promise<Session | null> {
    const recentSession = this.items.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )[0]

    if (!recentSession) {
      return null
    }

    return recentSession
  }
}
