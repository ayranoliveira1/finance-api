import { Injectable } from '@nestjs/common'
import OpenAI from 'openai'
import { EnvService } from '../env/env.service'
import { OpenAIRepository } from '@/domain/application/reports/openai-repository'

@Injectable()
export class OpenAIService implements OpenAIRepository {
  public openai: OpenAI

  constructor(private envService: EnvService) {
    this.openai = new OpenAI({
      apiKey: this.envService.get('OPENAI_API_KEY'),
    })
  }

  async generateIAReport(content: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Você é um especialista em gestão e organização de finanças pessoais. Você ajuda as pessoas a organizarem melhor as suas finanças.',
        },
        {
          role: 'user',
          content,
        },
      ],
    })

    if (!completion.choices[0].message.content) {
      return 'Desculpe, não consegui gerar o relatório.'
    }

    return completion.choices[0].message.content
  }
}
