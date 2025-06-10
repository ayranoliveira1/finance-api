import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UserRepository } from '@/domain/application/repositories/user-repository'
import { PrimsaUserRepository } from './prisma/repositories/prisma-user-repository'
import { TransactionRepository } from '@/domain/application/repositories/transaction-repository'
import { PrismaTransactionRepository } from './prisma/repositories/prisma-transaction-repository'
import { SessionRepository } from '@/domain/application/repositories/session-repository'
import { PrismaSessionRepository } from './prisma/repositories/prisma-session-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrimsaUserRepository,
    },
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
    {
      provide: SessionRepository,
      useClass: PrismaSessionRepository,
    },
  ],
  exports: [
    PrismaService,
    UserRepository,
    TransactionRepository,
    SessionRepository,
  ],
})
export class DataBaseModule {}
