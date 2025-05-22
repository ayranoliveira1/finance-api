import { UseCaseError } from '@/core/@types/errors/use-case-errors'

export class ReportFailedError extends Error implements UseCaseError {
  constructor() {
    super('Failed to generate report')
  }
}
