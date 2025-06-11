import { AuthenticateUserUseCase } from '@/domain/application/use-case/user/authenticate-user'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { Response } from 'express'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { InvalidCredentialsError } from '@/domain/application/use-case/errors/invalid-credentials-error'
import { CreateSessionUseCase } from '@/domain/application/use-case/user/create-session'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { UAParser } from 'ua-parser-js'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  ip: z.string(),
})

type AuthenticateBodyType = z.infer<typeof authenticateBodySchema>

const bodyValidationType = new ZodValidationPipe(authenticateBodySchema)

@Controller('/auth/login')
@Public()
export class AuthenticateUserController {
  constructor(
    private authenticateUser: AuthenticateUserUseCase,
    private createSession: CreateSessionUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationType) body: AuthenticateBodyType,
    @Res({ passthrough: true }) res: Response,
    @Headers('user-agent') userAgent: string,
  ) {
    authenticateBodySchema.parse(body)

    const { email, password, ip } = body

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

    const { token, refreshToken, userId } = result.value

    const parser = new UAParser(userAgent)

    const browser = `${parser.getBrowser().name} ${parser.getBrowser().version}`
    const os = `${parser.getOS().name} ${parser.getOS().version}`

    const deviceInfo = parser.getDevice()
    const deviceType =
      deviceInfo.type ??
      (deviceInfo.vendor || deviceInfo.model ? 'unknown' : 'desktop')

    const response = await this.createSession.execute({
      ip,
      browser,
      os,
      deviceType,
      userId: userId,
    })

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })

    return {
      token: token,
    }
  }
}
