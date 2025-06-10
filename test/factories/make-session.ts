import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Session, SessionProps } from '@/domain/enterprise/entities/session'

import { faker } from '@faker-js/faker'

export function makeSession(
  overrides: Partial<SessionProps> = {},
  id?: UniqueEntityId,
) {
  const user = Session.create(
    {
      ip: faker.internet.ip(),
      browser: faker.internet.userAgent(),
      country: faker.location.country(),
      os: faker.system.fileName(),
      deviceType: faker.helpers.arrayElement(['desktop', 'mobile', 'tablet']),
      city: faker.location.city(),
      region: faker.location.state(),
      userId: faker.string.uuid(),
      ...overrides,
    },
    id,
  )

  return user
}
