import { Encrypter } from '@/domain/application/cryptography/encrypter'

export class FakerEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
  async encryptRefresh(payload: Record<string, unknown>) {
    return JSON.stringify(payload)
  }
  async decrypt(token: string) {
    return JSON.parse(token)
  }
  async decryptRefresh(token: string) {
    return JSON.parse(token)
  }
}
