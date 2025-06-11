import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { FetchRecentSessionUseCase } from '@/domain/application/use-case/user/fetch-recent-session'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { BadRequestException, Controller, Get } from '@nestjs/common'
import { SessionPresenter } from '../../presenters/session-presenter'

@Controller('sessions/recent')
export class FetchRecentSessionController {
  constructor(private fetchRecentSession: FetchRecentSessionUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.fetchRecentSession.execute({
      userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const response = result.value

    return {
      session: SessionPresenter.toHttp(response.session),
    }
  }
}
