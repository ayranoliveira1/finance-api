import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UserRepository } from '@/domain/application/repositories/user-repository'
import { PrimsaUserRepository } from './prisma/repositories/prisma-user-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrimsaUserRepository,
    },
  ],
  exports: [PrismaService, UserRepository],
})
export class DataBaseModule {}
