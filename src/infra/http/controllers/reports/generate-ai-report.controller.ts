import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { ReportFailedError } from '@/domain/application/use-case/errors/report-failed-error'
import { GenerateAIReportUseCase } from '@/domain/application/use-case/reports/generate-ai-report'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  Get,
  NotAcceptableException,
  Query,
} from '@nestjs/common'

@Controller('/ai-report')
export class GenerateAIReportController {
  constructor(private generateAIReport: GenerateAIReportUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    const result = await this.generateAIReport.execute({
      userId: user.sub,
      month,
      year,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case ReportFailedError:
          throw new NotAcceptableException(error.message)

        default: {
          throw new BadRequestException(error.message)
        }
      }
    }

    const report = result.value

    return report
  }
}
