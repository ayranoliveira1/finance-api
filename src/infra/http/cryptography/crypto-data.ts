import { Encryption } from '@/domain/application/cryptography/encryption'
import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto'
import { promisify } from 'util'

@Injectable()
export class CryptoData implements Encryption {
  private secretKey: string

  constructor(private envService: EnvService) {
    this.secretKey = this.envService.get('CRYPTO_SECRET_KEY')
  }

  async encrypt(data: string) {
    const iv = randomBytes(16)
    const key = (await promisify(scrypt)(this.secretKey, 'salt', 32)) as Buffer
    const cipher = createCipheriv('aes-256-cbc', key, iv)

    const encrypterText = Buffer.concat([cipher.update(data), cipher.final()])

    return encrypterText.toString('hex') + ':' + iv.toString('hex')
  }

  async decrypt(encrypted: string): Promise<string> {
    const [encryptedText, ivHex] = encrypted.split(':')
    const iv = Buffer.from(ivHex, 'hex')

    const key = (await promisify(scrypt)(this.secretKey, 'salt', 32)) as Buffer
    const decipher = createDecipheriv('aes-256-cbc', key, iv)
    const decryptedText = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, 'hex')),
      decipher.final(),
    ])

    return decryptedText.toString()
  }
}
