import { UseCaseError } from '@/core/@types/errors/use-case-errors'

export class UserAlreadyHasThePlanError extends Error implements UseCaseError {
  constructor() {
    super('User already has the plan')
  }
}
