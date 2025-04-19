import { Module } from '@nestjs/common'
import { DataBaseModule } from '../database/database.module'
import { CryptographyModule } from './cryptography/cryptography.module'
import { CreateAccountController } from './controllers/create-account.controller'
import { RegisterUseCase } from '@/domain/application/use-case/user/register'
import { AuthenticateUserController } from './controllers/authenticate-user.controller'
import { AuthenticateUserUseCase } from '@/domain/application/use-case/user/authenticate-user'
import { RefreshTokenController } from './controllers/refresh-token.controller'
import { RefreshTokenUseCase } from '@/domain/application/use-case/user/refresh-token'
import { CreateTransactionController } from './controllers/create-transaction.controller'
import { CreateTransactionUseCase } from '@/domain/application/use-case/transaction/create-transaction'

@Module({
  imports: [DataBaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateUserController,
    RefreshTokenController,
    CreateTransactionController,
  ],
  providers: [
    RegisterUseCase,
    AuthenticateUserUseCase,
    RefreshTokenUseCase,
    CreateTransactionUseCase,
  ],
})
export class HttpModule {}
