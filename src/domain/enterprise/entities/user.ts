import { Optional } from '@/core/@types/options'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface UserProps {
  name: string
  email: string
  password: string
  subscriptionPlan: string
  role: string
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

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get subscriptionPlan() {
    return this.props.subscriptionPlan
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

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'subscriptionPlan' | 'role'>,
    id?: UniqueEntityId,
  ) {
    const user = new User(
      {
        ...props,
        subscriptionPlan: props.subscriptionPlan ?? 'FREE',
        createdAt: props.createdAt ?? new Date(),
        role: props.role ?? 'USER',
      },
      id,
    )

    return user
  }
}
