import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '../../repositories/transaction-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/@types/errors/resource-not-found-error'
import { DashboardData } from '@/core/repositories/dashboard-data'

interface GetDashboardDataUseCaseRequest {
  userId: string
  month: string
  year: string
}

type GetDashboardDataUseCaseResponse = Either<
  ResourceNotFoundError,
  DashboardData
>

@Injectable()
export class GetDashboardDataUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({
    userId,
    month,
    year,
  }: GetDashboardDataUseCaseRequest): Promise<GetDashboardDataUseCaseResponse> {
    const dashboardData = await this.transactionRepository.getDashboard(
      userId,
      month,
      year,
    )

    if (!dashboardData) {
      return left(new ResourceNotFoundError())
    }

    return right(dashboardData)
  }
}
