import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Session } from '@/domain/enterprise/entities/session'
import { Prisma, Session as SessionPrisma } from '@prisma/client'

export class PrismaSessionMapper {
  static toDomain(raw: SessionPrisma): Session {
    return Session.create(
      {
        ip: raw.ip,
        browser: raw.browser,
        os: raw.os,
        city: raw.city,
        region: raw.region,
        country: raw.country,
        userId: raw.userId,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(domain: Session): Prisma.SessionUncheckedCreateInput {
    return {
      id: domain.id.toString(),
      ip: domain.ip,
      browser: domain.browser,
      os: domain.os,
      city: domain.city,
      region: domain.region,
      country: domain.country,
      userId: domain.userId,
    }
  }
}
