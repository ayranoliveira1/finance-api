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
import { GetCurrentMonthTransactionsCountController } from './controllers/transactions/get-current-month-transactions-count.controller'
import { GetCurrentMonthTransactionsCountUseCase } from '@/domain/application/use-case/transaction/get-current-month-transactions-count'
import { GetLastTransactionsUseCase } from '@/domain/application/use-case/transaction/get-last-transactions'
import { GetLastTransactionsController } from './controllers/transactions/get-last-transactions.controller'
import { GetDashboardDataController } from './controllers/transactions/get-dashboard-data.controller'
import { GetDashboardDataUseCase } from '@/domain/application/use-case/transaction/get-dashboard-data'
import { CancelPlanStripeController } from './controllers/cancel-plan-stripe.controller'
import { CancelPlanStripeUseCase } from '@/domain/application/use-case/payment/cancel-plan-stripe'
import { OpenAIModule } from '../reports/openai.module'
import { GenerateAIReportController } from './controllers/reports/generate-ai-report.controller'
import { GenerateAIReportUseCase } from '@/domain/application/use-case/reports/generate-ai-report'
import { CreateSessionUseCase } from '@/domain/application/use-case/user/create-session'
import { LocationModule } from '../location/location.module'
import { FetchRecentSessionController } from './controllers/user/fecth-recent-session.controller'
import { FetchRecentSessionUseCase } from '@/domain/application/use-case/user/fetch-recent-session'
import { VerifySessionUseCase } from '@/domain/application/use-case/user/verify-session'
import { NodemailerModule } from '../mail/nodemailer/nodemaile.module'

@Module({
  imports: [
    DataBaseModule,
    CryptographyModule,
    StripeModule,
    OpenAIModule,
    LocationModule,
    NodemailerModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateUserController,
    FetchRecentSessionController,
    RefreshTokenController,
    GetUserController,
    EditUserController,
    CreateTransactionController,
    FetchTransactionController,
    DeleteTransactionController,
    EditTransactionController,
    GetCurrentMonthTransactionsCountController,
    GetLastTransactionsController,
    GetDashboardDataController,
    CreateCheckoutStripeController,
    DeleteUserByUserController,
    StripeWebhookController,
    CancelPlanStripeController,
    GenerateAIReportController,
  ],
  providers: [
    RegisterUseCase,
    AuthenticateUserUseCase,
    CreateSessionUseCase,
    FetchRecentSessionUseCase,
    RefreshTokenUseCase,
    VerifySessionUseCase,
    GetUserUseCase,
    EditUserUseCase,
    CreateTransactionUseCase,
    FetchTransactionUseCase,
    DeleteTransactionUseCase,
    EditTransactionUseCase,
    GetCurrentMonthTransactionsCountUseCase,
    GetLastTransactionsUseCase,
    GetDashboardDataUseCase,
    CreateCheckoutStripeUseCase,
    DeleteUserByUserUseCase,
    StripeWebhookUseCase,
    CancelPlanStripeUseCase,
    GenerateAIReportUseCase,
  ],
})
export class HttpModule {}
