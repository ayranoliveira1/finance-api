import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { GetLastTransactionsUseCase } from '@/domain/application/use-case/transaction/get-last-transactions'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { TransactionPresenter } from '../../presenters/transaction-presenter'

@Controller('/transactions/last')
export class GetLastTransactionsController {
  constructor(private getLastTransactions: GetLastTransactionsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    const userId = user.sub

    const result = await this.getLastTransactions.execute({
      userId,
      month: month,
      year: year,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const transactions = result.value

    return {
      transactions: await Promise.all(
        transactions.map((transactions) =>
          TransactionPresenter.toHttp(transactions),
        ),
      ),
    }
  }
}
