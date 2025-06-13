import { Encryption } from '@/domain/application/cryptography/encryption'

export class FakerEncryption implements Encryption {
  async encrypt(data: string) {
    return `${data}-encrypted`
  }

  async decrypt(encrypted: string) {
    return encrypted.replace('-encrypted', '')
  }
}
