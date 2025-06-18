import { SendEmailVerifyUseCase } from '@/domain/application/use-case/mail/send-email-verify'
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

const sendEmailVerifyBodySchema = z.object({
  email: z.string().email(),
})

type SendEmailVerifyBodyType = z.infer<typeof sendEmailVerifyBodySchema>

const bodyValidationType = new ZodValidationPipe(sendEmailVerifyBodySchema)

@Controller('mail/send-email-verify')
@Public()
export class SendEmailVerifyController {
  constructor(private sendEmailVerify: SendEmailVerifyUseCase) {}

  @Post()
  async handle(@Body(bodyValidationType) body: SendEmailVerifyBodyType) {
    const result = await this.sendEmailVerify.execute({
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
