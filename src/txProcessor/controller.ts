import {
	createTransactionFromPool,
	getPoolTransactionsToRegister,
	verifyPoolTransaction
} from './service'

export const processPoolTransactionsToRegister = async () => {
	const pool_txs = await getPoolTransactionsToRegister()

	for (const pool_tx of pool_txs) {
		console.log('Processing pool transaction: ', pool_tx.pool_transaction_id)

		const tx_verified = await verifyPoolTransaction(pool_tx)
		if (!tx_verified) {
			// set rejected status
		}

		console.log('Creating transaction from pool transaction: ', pool_tx.pool_transaction_id)
		await createTransactionFromPool(pool_tx)
	}
}
