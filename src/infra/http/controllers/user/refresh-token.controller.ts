import { RefreshTokenUseCase } from '@/domain/application/use-case/user/refresh-token'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  Req,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { InvalidCredentialsError } from '@/domain/application/use-case/errors/invalid-credentials-error'
import { Public } from '@/infra/auth/public'
import { VerifySessionUseCase } from '@/domain/application/use-case/user/verify-session'

@Controller('/auth/refresh-token')
@Public()
export class RefreshTokenController {
  constructor(
    private refreshTokenUseCase: RefreshTokenUseCase,
    private verifySession: VerifySessionUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const refreshToken = req.headers.cookie?.split(';')[0].split('=')[1]
    const sessionId = req.headers.cookie?.split(';')[1]?.split('=')[1]

    if (!refreshToken) {
      throw new BadRequestException('Refresh token not found')
    }

    if (!sessionId) {
      throw new BadRequestException('Session ID not found')
    }

    const sessionResult = await this.verifySession.execute({
      sessionId: sessionId,
    })

    if (sessionResult.isLeft()) {
      const error = sessionResult.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const result = await this.refreshTokenUseCase.execute({
      refreshToken: refreshToken,
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

    res.cookie('refresh_token', result.value.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })

    res.cookie('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    return {
      token: result.value.token,
    }
  }
}
