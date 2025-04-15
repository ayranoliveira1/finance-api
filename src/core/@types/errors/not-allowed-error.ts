import { UseCaseError } from '@/core/@types/errors/use-case-errors'

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed')
  }
}
