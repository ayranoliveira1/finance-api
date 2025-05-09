import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { GetDashboardDataUseCase } from '@/domain/application/use-case/transaction/get-dashboard-data'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common'

@Controller('/dashboard')
export class GetDashboardDataController {
  constructor(private getDashboardData: GetDashboardDataUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    const userId = user.sub

    const result = await this.getDashboardData.execute({
      userId,
      month,
      year,
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

    const dashboardData = result.value

    return dashboardData
  }
}
