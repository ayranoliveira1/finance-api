import { Injectable } from '@nestjs/common'
import { LocationMethods } from '../../location/location'
import { Either, left, right } from '@/core/either'
import { SessionRepository } from '../../repositories/session-repository'
import { Session } from '@/domain/enterprise/entities/session'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'

interface CreateSessionUseCaseRequest {
  ip: string
  browser: string
  userId: string
}

type CreateSessionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    session: Session
  }
>

@Injectable()
export class CreateSessionUseCase {
  constructor(
    private sessionRepository: SessionRepository,
    private locationMethods: LocationMethods,
  ) {}

  async execute({
    ip,
    browser,
    userId,
  }: CreateSessionUseCaseRequest): Promise<CreateSessionUseCaseResponse> {
    const location = await this.locationMethods.getLocationByIp(ip)

    if (!location) {
      return left(new ResourceNotFoundError())
    }

    const session = Session.create({
      ip,
      browser,
      country: location.country,
      city: location.city,
      region: location.region,
      userId,
    })

    await this.sessionRepository.create(session)

    return right({ session })
  }
}
