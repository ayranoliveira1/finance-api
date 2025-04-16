import { Module } from '@nestjs/common'
import { JwrEcrypter } from './jwt-encrypter'
import { BcryptHasher } from './bcrypt-hasher'
import { Encrypter } from '@/domain/application/cryptography/encrypter'
import { HashCompare } from '@/domain/application/cryptography/hash-compare'
import { HashGenerate } from '@/domain/application/cryptography/hash-generate'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwrEcrypter,
    },
    {
      provide: HashCompare,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerate,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashCompare, HashGenerate],
})
export class CryptographyModule {}
