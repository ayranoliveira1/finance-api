import { Session } from '@/domain/enterprise/entities/session'

export abstract class SessionRepository {
  abstract findManyRecent(userId: string): Promise<Session | null>
  abstract create(session: Session): Promise<void>
  abstract delete(session: Session): Promise<void>
}
