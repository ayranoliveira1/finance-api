import { Module } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { StripeMethods } from '@/domain/application/payment/stripe'
import { StripeInfraMethods } from './stripe-infra'

@Module({
  providers: [
    EnvService,
    StripeInfraMethods,
    {
      provide: StripeMethods,
      useClass: StripeInfraMethods,
    },
  ],
  exports: [EnvService, StripeMethods, StripeInfraMethods],
})
export class StripeModule {}
