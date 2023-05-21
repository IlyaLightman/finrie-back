import { calcPoolTransactionsUserSum } from './modules/pool_transaction/pool_tx.service'
import { calcUserBalanceByTransactions } from './modules/transactions/tx.service'

export const getUserBalance = async (system_id: string, user_id: string): Promise<number> => {
	// todo: + weekly_statements
	return await calcUserBalanceByTransactions(system_id, user_id)
}

export const getUserUnregisteredBalance = async (
	system_id: string,
	user_id: string
): Promise<number> => {
	const confirmed_balance = await getUserBalance(system_id, user_id)
	const unconfirmed_sum = await calcPoolTransactionsUserSum(system_id, user_id)
	return confirmed_balance + unconfirmed_sum
}
