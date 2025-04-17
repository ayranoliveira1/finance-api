import { Encrypter } from '@/domain/application/cryptography/encrypter'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwrEcrypter implements Encrypter {
  constructor(private jwt: JwtService) {}

  encrypt(payload: Record<string, unknown>) {
    return this.jwt.signAsync(payload, {
      expiresIn: '1m',
      algorithm: 'RS256',
    })
  }

  encryptRefresh(payload: Record<string, unknown>) {
    return this.jwt.signAsync(payload, {
      expiresIn: '3d',
      algorithm: 'RS256',
    })
  }
  decrypt(token: string) {
    return this.jwt.verifyAsync(token, {
      algorithms: ['RS256'],
    })
  }
  decryptRefresh(token: string) {
    return this.jwt.verifyAsync(token, {
      algorithms: ['RS256'],
    })
  }
}
