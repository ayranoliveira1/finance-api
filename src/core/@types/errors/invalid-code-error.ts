import { UseCaseError } from './use-case-errors'

export class InvalidCodeError extends Error implements UseCaseError {
  constructor() {
    super('Invalid code provided')
    this.name = 'InvalidCodeError'
  }
}
