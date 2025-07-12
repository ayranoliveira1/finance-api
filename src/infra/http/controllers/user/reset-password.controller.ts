import { InvalidCodeError } from '@/core/@types/errors/invalid-code-error'
import { VerificationCodeExpiredError } from '@/core/@types/errors/verification-code-expired-error'
import { InvalidCredentialsError } from '@/domain/application/use-case/errors/invalid-credentials-error'
import { ResetPasswordUseCase } from '@/domain/application/use-case/user/reset-password'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8),
  confirmNewPassword: z.string().min(8),
})

export type ResetPasswordType = z.infer<typeof resetPasswordSchema>

const bodyValidationType = new ZodValidationPipe(resetPasswordSchema)

@Controller('user/reset-password')
@Public()
export class ResetPasswordController {
  constructor(private resetPassword: ResetPasswordUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationType) body: ResetPasswordType,
    @Query('code') code: string,
  ) {
    resetPasswordSchema.parse(body)

    const { newPassword, confirmNewPassword } = body

    const result = await this.resetPassword.execute({
      code,
      newPassword,
      confirmNewPassword,
    })

    console.log('ResetPasswordController', result.value)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        case InvalidCodeError:
          throw new UnauthorizedException(error.message)
        case VerificationCodeExpiredError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const message = result.value

    return {
      message: message.message,
    }
  }
}
