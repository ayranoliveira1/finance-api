import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { Either, left, right } from '@/core/either'
import { Session } from '@/domain/enterprise/entities/session'
import { Injectable } from '@nestjs/common'
import { SessionRepository } from '../../repositories/session-repository'
import { Encryption } from '../../cryptography/encryption'

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
  constructor(
    private sessionRepository: SessionRepository,
    private encryption: Encryption,
  ) {}

  async execute({
    userId,
  }: FetchRecentSessionUseCaseRequest): Promise<FetchRecentSessionUseCaseResponse> {
    const recentSession = await this.sessionRepository.findManyRecent(userId)

    if (!recentSession) {
      return left(new ResourceNotFoundError())
    }

    const session = Session.create(
      {
        ip: await this.encryption.decrypt(recentSession.ip),
        browser: await this.encryption.decrypt(recentSession.browser),
        os: await this.encryption.decrypt(recentSession.os),
        deviceType: await this.encryption.decrypt(recentSession.deviceType),
        country: await this.encryption.decrypt(recentSession.country),
        city: await this.encryption.decrypt(recentSession.city),
        region: await this.encryption.decrypt(recentSession.region),
        createdAt: recentSession.createdAt,
        updatedAt: recentSession.updatedAt,
        userId: recentSession.userId,
      },
      recentSession.id,
    )

    return right({
      session: session,
    })
  }
}
