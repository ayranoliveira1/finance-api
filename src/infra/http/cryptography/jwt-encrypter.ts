import { Encrypter } from '@/domain/application/cryptography/encrypter'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwrEcrypter implements Encrypter {
  constructor(private jwt: JwtService) {}

  encrypt(payload: Record<string, unknown>) {
    return this.jwt.signAsync(payload)
  }
}
