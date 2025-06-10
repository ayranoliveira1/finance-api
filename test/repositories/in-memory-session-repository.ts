import { Session } from '@/domain/enterprise/entities/session'

export class InMemorySessionRepository {
  public items: Session[] = []

  async create(session: Session) {
    this.items.push(session)
  }
}
