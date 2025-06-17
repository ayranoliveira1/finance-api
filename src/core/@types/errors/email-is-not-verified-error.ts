import { UseCaseError } from './use-case-errors'

export class EmailNotVerifiedError extends Error implements UseCaseError {
  constructor() {
    super('Email is not verified')
    this.name = 'EmailNotVerifiedError'
  }
}
