import { Injectable } from '@nestjs/common'
import { LocationMethods } from '../../location/location'
import { Either, left, right } from '@/core/either'
import { SessionRepository } from '../../repositories/session-repository'
import { Session } from '@/domain/enterprise/entities/session'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { Encryption } from '../../cryptography/encryption'

interface CreateSessionUseCaseRequest {
  ip: string
  browser: string
  os: string
  deviceType: string
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
    private encryption: Encryption,
  ) {}

  async execute({
    ip,
    browser,
    os,
    deviceType,
    userId,
  }: CreateSessionUseCaseRequest): Promise<CreateSessionUseCaseResponse> {
    const sessionExists = await this.sessionRepository.findByUserId(userId)

    if (sessionExists) {
      await this.sessionRepository.delete(sessionExists)
    }

    const location = await this.locationMethods.getLocationByIp(ip)

    if (!location) {
      return left(new ResourceNotFoundError())
    }

    const ipEncrypted = await this.encryption.encrypt(ip)
    const browserEncrypted = await this.encryption.encrypt(browser)
    const osEncrypted = await this.encryption.encrypt(os)
    const deviceTypeEncrypted = await this.encryption.encrypt(deviceType)
    const countryEncrypted = await this.encryption.encrypt(location.country)
    const cityEncrypted = await this.encryption.encrypt(location.city)
    const regionEncrypted = await this.encryption.encrypt(location.region)

    const session = Session.create({
      ip: ipEncrypted,
      browser: browserEncrypted,
      os: osEncrypted,
      deviceType: deviceTypeEncrypted,
      country: countryEncrypted,
      city: cityEncrypted,
      region: regionEncrypted,
      userId,
    })

    await this.sessionRepository.create(session)

    return right({ session })
  }
}
