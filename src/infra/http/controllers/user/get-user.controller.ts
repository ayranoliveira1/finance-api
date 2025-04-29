import { InvalidCredentialsError } from '@/domain/application/use-case/errors/invalid-credentials-error'
import { GetUserUseCase } from '@/domain/application/use-case/user/get-user'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common'
import { UserPresenter } from '../../presenters/user-presenter'

@Controller('/auth/me')
export class GetUserController {
  constructor(private getUser: GetUserUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.getUser.execute({ userId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const response = result.value

    return {
      user: UserPresenter.toHttp(response.user),
    }
  }
}
