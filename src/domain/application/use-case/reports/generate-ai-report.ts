import { Injectable } from '@nestjs/common'
import { OpenAIRepository } from '../../reports/openai-repository'
import { TransactionRepository } from '../../repositories/transaction-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { ReportFailedError } from '../errors/report-failed-error'

interface GenerateAIReportUseCaseRequest {
  userId: string
  month: string
  year: string
}

type GenerateAIReportUseCaseResponse = Either<
  ResourceNotFoundError | ReportFailedError,
  string
>

@Injectable()
export class GenerateAIReportUseCase {
  constructor(
    private openAIRepository: OpenAIRepository,
    private transactionRepository: TransactionRepository,
  ) {}

  async execute({
    userId,
    month,
    year,
  }: GenerateAIReportUseCaseRequest): Promise<GenerateAIReportUseCaseResponse> {
    const transactions =
      await this.transactionRepository.getCurrentMonthTransactions(
        userId,
        month,
        year,
      )

    if (!transactions) {
      return left(new ResourceNotFoundError())
    }

    const content = `Gere um relatório com insights sobre as minhas finanças, com dicas e orientações de como melhorar minha vida financeira. As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA}-{TIPO}-{VALOR}-{CATEGORIA}. São elas: ${transactions
      .map(
        (transaction) =>
          `${transaction.date.toLocaleDateString('pt-BR')}-${transaction.type}-${transaction.amount}=${transaction.category}`,
      )
      .join(';')}`

    const report = await this.openAIRepository.generateIAReport(content)

    if (!report) {
      return left(new ReportFailedError())
    }

    return right(report)
  }
}
