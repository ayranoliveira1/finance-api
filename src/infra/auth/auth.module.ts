import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt-strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuart } from './jwt-auth-guard'
import { EnvService } from '../env/env.service'
import { EnvModule } from '../env/env.module'
import { RefreshJwtStrategy } from './refresh-jwt-strategy'
import { RefreshJwtGuard } from './refresh-jwt-guard'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: ConfigService) {
        const privateKey = env.get('JWT_PRIVATE_KEY')
        const publicKey = env.get('JWT_PUBLIC_KEY')
        const refreshPrivateKey = env.get('JWT_REFRESH_PRIVATE_KEY')
        const refreshPublicKey = env.get('JWT_REFRESH_PUBLIC_KEY')

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),

          verifyOptions: { algorithms: ['RS256'] },
          refreshTokenOptions: {
            privateKey: Buffer.from(refreshPrivateKey, 'base64'),
            publicKey: Buffer.from(refreshPublicKey, 'base64'),
            signOptions: {
              algorithm: 'RS256',
              expiresIn: '7d',
            },
          },
        }
      },
    }),
  ],
  providers: [
    JwtStrategy,
    RefreshJwtGuard,
    RefreshJwtStrategy,
    EnvService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuart,
    },
  ],
})
export class AuthModule {}
