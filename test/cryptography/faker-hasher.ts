import { HashCompare } from '@/domain/application/cryptography/hash-compare'
import { HashGenerate } from '@/domain/application/cryptography/hash-generate'

export class FakerHasher implements HashGenerate, HashCompare {
  async hash(plain: string) {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hashed: string) {
    return plain.concat('-hashed') === hashed
  }
}
