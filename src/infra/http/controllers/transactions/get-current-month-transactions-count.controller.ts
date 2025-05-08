import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { GetCurrentMonthTransactionsCountUseCase } from '@/domain/application/use-case/transaction/get-current-month-transactions-count'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
} from '@nestjs/common'
import { endOfMonth, startOfMonth } from 'date-fns'

@Controller()
export class GetCurrentMonthTransactionsCountController {
  constructor(
    private getCurrentMonthTransactionsCount: GetCurrentMonthTransactionsCountUseCase,
  ) {}

  @Get('/transactions/current-month/count')
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const start = startOfMonth(new Date())
    const end = endOfMonth(new Date())

    const result = await this.getCurrentMonthTransactionsCount.execute({
      userId,
      start,
      end,
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

    const count = result.value
    return count
  }
}
