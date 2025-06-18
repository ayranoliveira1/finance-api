import { UserStatus } from '@/core/@types/enums'
import { Optional } from '@/core/@types/options'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface UserProps {
  name: string
  email: string
  password: string
  subscriptionPlan: string
  role: string
  status?: UserStatus
  isEmailVerified?: boolean
  verificationCode?: string | null
  codeExpiresAt?: Date | null
  createdAt: Date
  updatedAt?: Date
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get role() {
    return this.props.role
  }

  get password() {
    return this.props.password
  }

  get status() {
    return this.props.status ?? UserStatus.ACTIVE
  }

  get subscriptionPlan() {
    return this.props.subscriptionPlan
  }

  get isEmailVerified() {
    return this.props.isEmailVerified ?? false
  }

  get verificationCode() {
    return this.props.verificationCode ?? null
  }

  get codeExpiresAt() {
    return this.props.codeExpiresAt ?? null
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  set role(role: string) {
    this.props.role = role
    this.touch()
  }

  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  set subscriptionPlan(subscriptionPlan: string) {
    this.props.subscriptionPlan = subscriptionPlan
    this.touch()
  }

  set status(status: UserStatus) {
    this.props.status = status
    this.touch()
  }

  set isEmailVerified(isEmailVerified: boolean) {
    this.props.isEmailVerified = isEmailVerified
    this.touch()
  }

  set verificationCode(verificationCode: string | null) {
    this.props.verificationCode = verificationCode
    this.touch()
  }

  set codeExpiresAt(codeExpiresAt: Date | null) {
    this.props.codeExpiresAt = codeExpiresAt
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  setVerificationCode(code: string, expiresAt: Date) {
    this.props.verificationCode = code
    this.props.codeExpiresAt = expiresAt
    this.touch()
  }

  verify() {
    this.props.isEmailVerified = true
    this.props.verificationCode = null
    this.props.codeExpiresAt = null
    this.touch()
  }

  static create(
    props: Optional<
      UserProps,
      'createdAt' | 'subscriptionPlan' | 'isEmailVerified' | 'status' | 'role'
    >,
    id?: UniqueEntityId,
  ) {
    const user = new User(
      {
        ...props,
        subscriptionPlan: props.subscriptionPlan ?? 'FREE',
        createdAt: props.createdAt ?? new Date(),
        role: props.role ?? 'USER',
        isEmailVerified: props.isEmailVerified ?? false,
        status: props.status ?? UserStatus.ACTIVE,
      },
      id,
    )

    return user
  }
}
