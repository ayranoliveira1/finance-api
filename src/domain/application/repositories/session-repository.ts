import { Session } from '@/domain/enterprise/entities/session'

export abstract class SessionRepository {
  abstract findById(id: string): Promise<Session | null>
  abstract findByUserId(userId: string): Promise<Session | null>
  abstract findManyRecent(userId: string): Promise<Session | null>
  abstract create(session: Session): Promise<void>
  abstract delete(session: Session): Promise<void>
}
