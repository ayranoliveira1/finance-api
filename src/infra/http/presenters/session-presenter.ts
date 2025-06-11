import { Session } from '@/domain/enterprise/entities/session'

export class SessionPresenter {
  static toHttp(session: Session) {
    return {
      id: session.id.toString(),
      ip: session.ip,
      browser: session.browser,
      os: session.os,
      deviceType: session.deviceType,
      city: session.city,
      region: session.region,
      country: session.country,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }
  }
}
