import { Optional } from '@/core/@types/options'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface SessionProps {
  ip: string
  browser: string
  os: string
  deviceType: string
  country: string
  city: string
  region: string
  userId: string
  createdAt: Date
  updatedAt?: Date
}

export class Session extends Entity<SessionProps> {
  get ip() {
    return this.props.ip
  }

  get browser() {
    return this.props.browser
  }

  get os() {
    return this.props.os
  }

  get deviceType() {
    return this.props.deviceType
  }

  get country() {
    return this.props.country
  }

  get city() {
    return this.props.city
  }

  get region() {
    return this.props.region
  }

  get userId() {
    return this.props.userId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set ip(ip: string) {
    this.props.ip = ip
    this.touch()
  }

  set browser(browser: string) {
    this.props.browser = browser
    this.touch()
  }

  set os(os: string) {
    this.props.os = os
    this.touch()
  }

  set deviceType(deviceType: string) {
    this.props.deviceType = deviceType
    this.touch()
  }
  set country(country: string) {
    this.props.country = country
    this.touch()
  }

  set city(city: string) {
    this.props.city = city
    this.touch()
  }

  set region(region: string) {
    this.props.region = region
    this.touch()
  }

  touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<SessionProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const location = new Session(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return location
  }
}
