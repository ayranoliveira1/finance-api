import { Session } from '@/domain/enterprise/entities/session'

export abstract class SessionRepository {
  abstract create(session: Session): Promise<void>
  abstract findManyRecent(): Promise<Session | null>
}
