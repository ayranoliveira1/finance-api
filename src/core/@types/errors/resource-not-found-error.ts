import { UseCaseError } from '@/core/@types/errors/use-case-errors'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Resource not found')
  }
}
