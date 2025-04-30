import { EditUserUseCase } from '@/domain/application/use-case/user/edit-user'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Patch,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { InvalidCredentialsError } from '@/domain/application/use-case/errors/invalid-credentials-error'
import { UserAlreadyExistsError } from '@/domain/application/use-case/errors/user-already-exists-error'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'

const editUserBodySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  confirmPassword: z.string().min(8).max(50).optional(),
  newPassword: z.string().min(8).max(50).optional(),
})

type EditUserBodyType = z.infer<typeof editUserBodySchema>

const bodyValidationType = new ZodValidationPipe(editUserBodySchema)

@Controller('/user')
export class EditUserController {
  constructor(private editUser: EditUserUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationType) body: EditUserBodyType,
    @CurrentUser() user: UserPayload,
  ) {
    editUserBodySchema.parse(body)

    const { name, email, confirmPassword, newPassword } = body

    const userId = user.sub

    const result = await this.editUser.execute({
      userId,
      name,
      email,
      confirmPassword,
      newPassword,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
