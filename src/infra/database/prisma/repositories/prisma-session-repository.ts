import { SessionRepository } from '@/domain/application/repositories/session-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaSessionMapper } from '../mappers/prisma-session-mapper'
import { Session } from '@/domain/enterprise/entities/session'

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const session = await this.prisma.session.findUnique({
      where: {
        id,
      },
    })

    if (!session) return null

    return PrismaSessionMapper.toDomain(session)
  }

  async findByUserId(userId: string) {
    const session = await this.prisma.session.findFirst({
      where: {
        userId,
      },
    })

    if (!session) return null

    return PrismaSessionMapper.toDomain(session)
  }

  async findManyRecent(userId: string) {
    const recentSession = await this.prisma.session.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!recentSession) return null

    return PrismaSessionMapper.toDomain(recentSession)
  }

  async create(session: Session) {
    const data = PrismaSessionMapper.toPrisma(session)

    await this.prisma.session.create({
      data,
    })
  }

  async delete(session: Session) {
    const data = PrismaSessionMapper.toPrisma(session)

    await this.prisma.session.delete({
      where: {
        id: data.id,
      },
    })
  }
}
