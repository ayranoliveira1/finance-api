import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/enterprise/entities/user'

import { faker } from '@faker-js/faker'

export function makeUser(
  overrides: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {
  const question = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...overrides,
    },
    id,
  )

  return question
}
