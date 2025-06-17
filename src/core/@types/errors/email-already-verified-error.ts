import { UseCaseError } from './use-case-errors'

export class EmailAlreadyVerifiedError extends Error implements UseCaseError {
  constructor() {
    super('Email is already verified')
    this.name = 'EmailAlreadyVerifiedError'
  }
}
