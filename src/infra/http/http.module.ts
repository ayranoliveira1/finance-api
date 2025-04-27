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
import { FetchTransactionController } from './controllers/fetch-transaction.controller'
import { FetchTransactionUseCase } from '@/domain/application/use-case/transaction/fetch-transaction'
import { DeleteTransactionController } from './controllers/delete-transaction.controller'
import { DeleteTransactionUseCase } from '@/domain/application/use-case/transaction/delete-transaction'
import { EditTransactionController } from './controllers/edit-transaction.controller'
import { EditTransactionUseCase } from '@/domain/application/use-case/transaction/edit-transaction'
import { CreateCheckoutStripeController } from './controllers/create-checkout-stripe.controller'
import { CreateCheckoutStripeUseCase } from '@/domain/application/use-case/payment/create-checkout-stripe'
import { StripeModule } from '../payment/stripe.module'
import { DeleteUserByUserController } from './controllers/delete-user-by-user.controller'
import { DeleteUserByUserUseCase } from '@/domain/application/use-case/user/delete-user-by-user'

@Module({
  imports: [DataBaseModule, CryptographyModule, StripeModule],
  controllers: [
    CreateAccountController,
    AuthenticateUserController,
    RefreshTokenController,
    CreateTransactionController,
    FetchTransactionController,
    DeleteTransactionController,
    EditTransactionController,
    CreateCheckoutStripeController,
    DeleteUserByUserController,
  ],
  providers: [
    RegisterUseCase,
    AuthenticateUserUseCase,
    RefreshTokenUseCase,
    CreateTransactionUseCase,
    FetchTransactionUseCase,
    DeleteTransactionUseCase,
    EditTransactionUseCase,
    CreateCheckoutStripeUseCase,
    DeleteUserByUserUseCase,
  ],
})
export class HttpModule {}
