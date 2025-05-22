import { Module } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { OpenAIRepository } from '@/domain/application/reports/openai-repository'
import { OpenAIService } from './openai.service'

@Module({
  providers: [
    EnvService,
    OpenAIService,
    {
      provide: OpenAIRepository,
      useClass: OpenAIService,
    },
  ],
  exports: [EnvService, OpenAIRepository, OpenAIService],
})
export class OpenAIModule {}
