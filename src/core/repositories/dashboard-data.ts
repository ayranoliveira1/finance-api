import { TotalExpensePerCategory } from '../../infra/database/prisma/@types/total-expense-per-category'
import { TransactionPercentagePerType } from '../@types/transaction-percentage-per-type'

export interface DashboardData {
  balanc: number
  depositTotal: number
  investmentTotal: number
  expensesTotal: number
  typesPercentage: TransactionPercentagePerType
  totalExpensePerCategory: TotalExpensePerCategory[]
}
