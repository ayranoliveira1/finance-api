import { Module } from '@nestjs/common'
import { JwrEcrypter } from './jwt-encrypter'
import { BcryptHasher } from './bcrypt-hasher'
import { Encrypter } from '@/domain/application/cryptography/encrypter'
import { HashCompare } from '@/domain/application/cryptography/hash-compare'
import { HashGenerate } from '@/domain/application/cryptography/hash-generate'
import { Encryption } from '@/domain/application/cryptography/encryption'
import { CryptoData } from './crypto-data'
import { EnvService } from '@/infra/env/env.service'

@Module({
  providers: [
    EnvService,
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
    {
      provide: Encryption,
      useClass: CryptoData,
    },
  ],
  exports: [Encrypter, HashCompare, HashGenerate, Encryption],
})
export class CryptographyModule {}
