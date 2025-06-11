import { Session } from '@/domain/enterprise/entities/session'

export abstract class SessionRepository {
  abstract create(session: Session): Promise<void>
  abstract findManyRecent(userId: string): Promise<Session | null>
}
