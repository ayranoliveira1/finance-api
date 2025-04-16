import { User } from '@/domain/enterprise/entities/user'

export class UserPresenter {
  static toHttp(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      subscriptionPlan: user.subscriptionPlan,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
