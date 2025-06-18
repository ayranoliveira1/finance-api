import { UserRepository } from '@/domain/application/repositories/user-repository'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { User } from '@/domain/enterprise/entities/user'
import { SubscriptionPlan } from '@/core/@types/enums'

@Injectable()
export class PrimsaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        isEmailVerified: true,
        status: 'ACTIVE',
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async create(user: User) {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.create({
      data,
    })
  }

  async delete(user: User) {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.delete({
      where: {
        id: data.id,
        isEmailVerified: true,
        status: 'ACTIVE',
      },
    })
  }

  async updatePlan(userID: string, plan: string) {
    const planUser =
      plan === 'premium' ? SubscriptionPlan.PREMIUM : SubscriptionPlan.FREE

    await this.prisma.user.update({
      where: {
        id: userID,
        isEmailVerified: true,
        status: 'ACTIVE',
      },
      data: {
        subscriptionPlan: planUser,
      },
    })
  }

  async save(user: User) {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.update({
      where: {
        id: data.id,
        status: 'ACTIVE',
      },
      data,
    })
  }
}
