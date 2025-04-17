import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'
import { EnvService } from '../env/env.service'

// Schema específico para refresh token (pode adicionar mais campos se necessário)
const refreshTokenSchema = z.object({
  sub: z.string().uuid(),
})

export type RefreshTokenPayload = z.infer<typeof refreshTokenSchema>

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(config: EnvService) {
    const refreshPublicKey = config.get('JWT_REFRESH_PUBLIC_KEY')

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return (
            req?.cookies?.refresh_token ||
            ExtractJwt.fromAuthHeaderAsBearerToken()(req)
          )
        },
      ]),
      secretOrKey: Buffer.from(refreshPublicKey, 'base64'),
      algorithms: ['RS256'],
      ignoreExpiration: false,
      passReqToCallback: true,
    })
  }

  async validate(payload: RefreshTokenPayload) {
    return refreshTokenSchema.parse(payload)
  }
}
