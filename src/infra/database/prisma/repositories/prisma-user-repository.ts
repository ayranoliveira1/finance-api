import { UserRepository } from '@/domain/application/repositories/user-repository'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { User } from '@/domain/enterprise/entities/user'

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
      },
    })
  }
}
