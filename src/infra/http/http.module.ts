import { Module } from '@nestjs/common'
import { DataBaseModule } from '../database/database.module'
import { CryptographyModule } from './cryptography/cryptography.module'
import { CreateAccountController } from './controllers/create-account.controller'
import { RegisterUseCase } from '@/domain/application/use-case/user/register'
import { AuthenticateUserController } from './controllers/authenticate-user.controller'
import { AuthenticateUserUseCase } from '@/domain/application/use-case/user/authenticate-user'
import { RefreshTokenController } from './controllers/refresh-token.controller'
import { RefreshTokenUseCase } from '@/domain/application/use-case/user/refresh-token'

@Module({
  imports: [DataBaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateUserController,
    RefreshTokenController,
  ],
  providers: [RegisterUseCase, AuthenticateUserUseCase, RefreshTokenUseCase],
})
export class HttpModule {}
