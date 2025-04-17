import { RefreshTokenUseCase } from '@/domain/application/use-case/refresh-token'
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
import { Response } from 'express'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { InvalidCredentialsError } from '@/domain/application/use-case/errors/invalid-credentials-error'

const refreshteBodySchema = z.object({
  refreshToken: z.string(),
})

type RefreshteBodyType = z.infer<typeof refreshteBodySchema>

const bodyValidationType = new ZodValidationPipe(refreshteBodySchema)

@Controller('/auth/refresh-token')
@Public()
export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationType) body: RefreshteBodyType,
    @Res({ passthrough: true }) res: Response,
  ) {
    refreshteBodySchema.parse(body)

    const { refreshToken } = body

    const result = await this.refreshTokenUseCase.execute({
      refreshToken,
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

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })
    return {
      token: result.value.token,
    }
  }
}
