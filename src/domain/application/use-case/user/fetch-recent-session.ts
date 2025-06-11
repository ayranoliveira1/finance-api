import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { Either, left, right } from '@/core/either'
import { Session } from '@/domain/enterprise/entities/session'
import { Injectable } from '@nestjs/common'
import { SessionRepository } from '../../repositories/session-repository'

interface FetchRecentSessionUseCaseRequest {
  userId: string
}

type FetchRecentSessionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    session: Session
  }
>

@Injectable()
export class FetchRecentSessionUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute({
    userId,
  }: FetchRecentSessionUseCaseRequest): Promise<FetchRecentSessionUseCaseResponse> {
    const session = await this.sessionRepository.findManyRecent(userId)

    if (!session) {
      return left(new ResourceNotFoundError())
    }

    return right({
      session,
    })
  }
}
