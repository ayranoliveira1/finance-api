import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { VerifyUserUseCase } from '@/domain/application/use-case/user/verify-user'
import { InvalidCredentialsError } from '@/domain/application/use-case/errors/invalid-credentials-error'
import { EmailAlreadyVerifiedError } from '@/core/@types/errors/email-already-verified-error'
import { InvalidCodeError } from '@/core/@types/errors/invalid-code-error'
import { VerificationCodeExpiredError } from '@/core/@types/errors/verification-code-expired-error'
import { Public } from '@/infra/auth/public'

const verifyUserSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
})

export type VerifyEmailType = z.infer<typeof verifyUserSchema>

const bodyValidationtype = new ZodValidationPipe(verifyUserSchema)

@Controller()
@Public()
export class VerifyUserController {
  constructor(private verifyUser: VerifyUserUseCase) {}

  @Post('user/verify-email')
  async handle(@Body(bodyValidationtype) body: VerifyEmailType) {
    verifyUserSchema.parse(body)

    const { email, code } = body

    const result = await this.verifyUser.execute({
      email,
      code,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        case EmailAlreadyVerifiedError:
          throw new UnauthorizedException(error.message)
        case InvalidCodeError:
          throw new UnauthorizedException(error.message)
        case VerificationCodeExpiredError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
