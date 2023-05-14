import { calcUserBalanceByTransactions } from './modules/transactions/transaction.service'

export const getUserBalance = async (system_id: string, user_id: string): Promise<number> => {
	// todo: + weekly_statements
	return await calcUserBalanceByTransactions(system_id, user_id)
}
