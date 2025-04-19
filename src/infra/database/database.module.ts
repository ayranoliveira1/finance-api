import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UserRepository } from '@/domain/application/repositories/user-repository'
import { PrimsaUserRepository } from './prisma/repositories/prisma-user-repository'
import { TransactionRepository } from '@/domain/application/repositories/transaction-repository'
import { PrismaTransactionRepository } from './prisma/repositories/prisma-transaction-repository'

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
  ],
  exports: [PrismaService, UserRepository, TransactionRepository],
})
export class DataBaseModule {}
