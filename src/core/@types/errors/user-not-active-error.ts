import { UseCaseError } from './use-case-errors'

export class UserNotActiveError extends Error implements UseCaseError {
  constructor() {
    super('User is not active')
  }
}
