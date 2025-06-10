import { LocationResponse } from '@/core/@types/location'

export abstract class SessionRepository {
  abstract create(session: LocationResponse): Promise<void>
}
