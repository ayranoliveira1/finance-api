import { Module } from '@nestjs/common'
import { DataBaseModule } from '../database/database.module'
import { CryptographyModule } from './cryptography/cryptography.module'
import { CreateAccountController } from './controllers/create-account.controller'
import { RegisterUseCase } from '@/domain/application/use-case/register'

@Module({
  imports: [DataBaseModule, CryptographyModule],
  controllers: [CreateAccountController],
  providers: [RegisterUseCase],
})
export class HttpModule {}
