import { UseCaseError } from '@/core/@types/errors/use-case-errors'

export class InvalidCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('Invalid credentials')
  }
}
