import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from '@/core/@types/enums'
import { Optional } from '@/core/@types/options'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface TransactionProps {
  userId: UniqueEntityId
  name: string
  type: TransactionType
  amount: number
  category: TransactionCategory
  paymentMethod: TransactionPaymentMethod
  date: Date
  createdAt: Date
  updatedAt?: Date
}

export class Transaction extends Entity<TransactionProps> {
  get userId() {
    return this.props.userId
  }

  get name() {
    return this.props.name
  }

  get type() {
    return this.props.type
  }

  get amount() {
    return this.props.amount
  }

  get category() {
    return this.props.category
  }

  get paymentMethod() {
    return this.props.paymentMethod
  }

  get date() {
    return this.props.date
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

  set type(type: TransactionType) {
    this.props.type = type
    this.touch()
  }

  set amount(amount: number) {
    this.props.amount = amount
    this.touch()
  }

  set category(category: TransactionCategory) {
    this.props.category = category
    this.touch()
  }

  set paymentMethod(paymentMethod: TransactionPaymentMethod) {
    this.props.paymentMethod = paymentMethod
    this.touch()
  }

  set date(date: Date) {
    this.props.date = date
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<TransactionProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const transaction = new Transaction(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return transaction
  }
}
