import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { FetchTransactionUseCase } from '@/domain/application/use-case/transaction/fetch-transaction'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { TransactionPresenter } from '../presenters/transaction-presenter'

@Controller('/transactions')
export class FetchTransactionController {
  constructor(private fetchTransaction: FetchTransactionUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page') page?: string,
    @Query('search') search?: string,
  ) {
    const userId = user.sub

    const result = await this.fetchTransaction.execute({
      userId,
      page: Number(page),
      search: search || '',
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
        transactions.transactions.map((transaction) =>
          TransactionPresenter.toHttp(transaction),
        ),
      ),
      totalPages: transactions.totalPages,
      totalItems: transactions.totalItems,
      currentPage: transactions.currentPage,
      pageSize: transactions.pageSize,
    }
  }
}
