import { Module } from '@nestjs/common'
import { DataBaseModule } from '../database/database.module'
import { CryptographyModule } from './cryptography/cryptography.module'
import { CreateAccountController } from './controllers/user/create-account.controller'
import { RegisterUseCase } from '@/domain/application/use-case/user/register'
import { AuthenticateUserController } from './controllers/user/authenticate-user.controller'
import { AuthenticateUserUseCase } from '@/domain/application/use-case/user/authenticate-user'
import { RefreshTokenController } from './controllers/user/refresh-token.controller'
import { RefreshTokenUseCase } from '@/domain/application/use-case/user/refresh-token'
import { CreateTransactionUseCase } from '@/domain/application/use-case/transaction/create-transaction'
import { FetchTransactionUseCase } from '@/domain/application/use-case/transaction/fetch-transaction'
import { DeleteTransactionController } from './controllers/transactions/delete-transaction.controller'
import { DeleteTransactionUseCase } from '@/domain/application/use-case/transaction/delete-transaction'
import { EditTransactionUseCase } from '@/domain/application/use-case/transaction/edit-transaction'
import { CreateCheckoutStripeUseCase } from '@/domain/application/use-case/payment/create-checkout-stripe'
import { StripeModule } from '../payment/stripe.module'
import { DeleteUserByUserUseCase } from '@/domain/application/use-case/user/delete-user-by-user'
import { DeleteUserByUserController } from './controllers/user/delete-user-by-user.controller'
import { CreateTransactionController } from './controllers/transactions/create-transaction.controller'
import { FetchTransactionController } from './controllers/transactions/fetch-transaction.controller'
import { EditTransactionController } from './controllers/transactions/edit-transaction.controller'
import { CreateCheckoutStripeController } from './controllers/create-checkout-stripe.controller'
import { StripeWebhookController } from './controllers/stripe-webhook.controller'
import { StripeWebhookUseCase } from '@/domain/application/use-case/payment/stripe-webhook'
import { GetUserUseCase } from '@/domain/application/use-case/user/get-user'
import { GetUserController } from './controllers/user/get-user.controller'
import { EditUserController } from './controllers/user/edit-user.controller'
import { EditUserUseCase } from '@/domain/application/use-case/user/edit-user'

@Module({
  imports: [DataBaseModule, CryptographyModule, StripeModule],
  controllers: [
    CreateAccountController,
    AuthenticateUserController,
    RefreshTokenController,
    GetUserController,
    EditUserController,
    CreateTransactionController,
    FetchTransactionController,
    DeleteTransactionController,
    EditTransactionController,
    CreateCheckoutStripeController,
    DeleteUserByUserController,
    StripeWebhookController,
  ],
  providers: [
    RegisterUseCase,
    AuthenticateUserUseCase,
    RefreshTokenUseCase,
    GetUserUseCase,
    EditUserUseCase,
    CreateTransactionUseCase,
    FetchTransactionUseCase,
    DeleteTransactionUseCase,
    EditTransactionUseCase,
    CreateCheckoutStripeUseCase,
    DeleteUserByUserUseCase,
    StripeWebhookUseCase,
  ],
})
export class HttpModule {}
