import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { InvalidCredentialsError } from '@/domain/application/use-case/errors/invalid-credentials-error'
import { EmailAlreadyVerifiedError } from '@/core/@types/errors/email-already-verified-error'
import { SendEmailResetPasswordUseCase } from '@/domain/application/use-case/mail/send-email-reset-password'

const sendEmailResetPasswordBodySchema = z.object({
  email: z.string().email(),
})

type SendEmailResetPasswordBodyType = z.infer<
  typeof sendEmailResetPasswordBodySchema
>

const bodyValidationType = new ZodValidationPipe(
  sendEmailResetPasswordBodySchema,
)

@Controller('mail/send-email-reset-password')
@Public()
export class SendEmailResetPasswordController {
  constructor(private sendEmailResetPassword: SendEmailResetPasswordUseCase) {}

  @Post()
  async handle(@Body(bodyValidationType) body: SendEmailResetPasswordBodyType) {
    const result = await this.sendEmailResetPassword.execute({
      email: body.email,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        case EmailAlreadyVerifiedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
