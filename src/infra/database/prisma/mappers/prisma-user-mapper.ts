import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/enterprise/entities/user'
import { Prisma, User as PrisaUser } from '@prisma/client'

export class PrismaUserMapper {
  static toDomain(raw: PrisaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role,
        subscriptionPlan: raw.subscriptionPlan,
        codeExpiresAt: raw.codeExpirationDate,
        verificationCode: raw.verificationCode,
        isEmailVerified: raw.isEmailVerified,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
    }
  }
}
