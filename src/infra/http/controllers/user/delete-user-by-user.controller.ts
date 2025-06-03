import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { DeleteUserByUserUseCase } from '@/domain/application/use-case/user/delete-user-by-user'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { InvalidCredentialsError } from '@/domain/application/use-case/errors/invalid-credentials-error'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const deleteUserByUserBodySchema = z.object({
  password: z.string().min(8),
})

type DeleteUserByUserBodyType = z.infer<typeof deleteUserByUserBodySchema>

const bodyValidationPepe = new ZodValidationPipe(deleteUserByUserBodySchema)

@Controller('/user')
export class DeleteUserByUserController {
  constructor(private deleteUser: DeleteUserByUserUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPepe) body: DeleteUserByUserBodyType,
    @CurrentUser() user: UserPayload,
  ) {
    deleteUserByUserBodySchema.parse(body)

    const userId = user.sub

    const { password } = body

    const result = await this.deleteUser.execute({ userId, password })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
