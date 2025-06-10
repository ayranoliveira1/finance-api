import { SessionRepository } from '@/domain/application/repositories/session-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaSessionMapper } from '../mappers/prisma-session-mapper'
import { Session } from '@/domain/enterprise/entities/session'

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private prisma: PrismaService) {}

  async create(session: Session) {
    const data = PrismaSessionMapper.toPrisma(session)

    await this.prisma.session.create({
      data,
    })
  }
}
