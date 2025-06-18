import { UseCaseError } from './use-case-errors'

export class VerificationCodeExpiredError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Verification code has expired')
  }
}
