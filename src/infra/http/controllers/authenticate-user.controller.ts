import { AuthenticateUserUseCase } from '@/domain/application/use-case/user/authenticate-user'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { Response } from 'express'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { InvalidCredentialsError } from '@/domain/application/use-case/errors/invalid-credentials-error'
import { UserPresenter } from '../presenters/user-presenter'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type AuthenticateBodyType = z.infer<typeof authenticateBodySchema>

const bodyValidationType = new ZodValidationPipe(authenticateBodySchema)

@Controller('/auth/login')
@Public()
export class AuthenticateUserController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationType) body: AuthenticateBodyType,
    @Res({ passthrough: true }) res: Response,
  ) {
    authenticateBodySchema.parse(body)

    const { email, password } = body

    const result = await this.authenticateUser.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { token, user, refreshToken } = result.value

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })

    return {
      token: token,
      user: UserPresenter.toHttp(user),
    }
  }
}
