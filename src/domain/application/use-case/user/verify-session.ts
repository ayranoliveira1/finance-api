import { Either, left, right } from '@/core/either'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { Session } from '@/domain/enterprise/entities/session'
import { Injectable } from '@nestjs/common'
import { SessionRepository } from '../../repositories/session-repository'

interface VerifySessionUseCaseRequest {
  sessionId: string
}

type VerifySessionUseCaseResponse = Either<
  InvalidCredentialsError,
  { session: Session }
>

@Injectable()
export class VerifySessionUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute({
    sessionId,
  }: VerifySessionUseCaseRequest): Promise<VerifySessionUseCaseResponse> {
    const session = await this.sessionRepository.findById(sessionId)

    if (!session) {
      return left(new InvalidCredentialsError())
    }

    return right({ session })
  }
}
