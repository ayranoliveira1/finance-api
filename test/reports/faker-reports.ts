import { OpenAIRepository } from '@/domain/application/reports/openai-repository'

export class FakerReports implements OpenAIRepository {
  async generateIAReport(content: string): Promise<string> {
    return `Relatório gerado com sucesso! Conteúdo: ${content}`
  }
}
