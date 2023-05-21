import { PoolTransaction, PoolTransactionStatus, Transaction } from '@prisma/client'
import prisma from '../utils/prisma'

export const getPoolTransactionsToRegister = async (): Promise<PoolTransaction[]> => {
	const pool_txs = await prisma.poolTransaction.findMany({
		where: {
			status: PoolTransactionStatus.processing
		},
		orderBy: { created_at: 'desc' }
	})

	return pool_txs
}

// tx could be verified by single query with getting
export const verifyPoolTransaction = async (
	pool_transaction: PoolTransaction
): Promise<boolean> => {
	return true
}

export const createTransactionFromPool = async (
	pool_transaction: PoolTransaction
): Promise<Transaction> => {
	const { pool_transaction_id, type, value, system_id, sender_id, receiver_id } = pool_transaction

	const txQuery = prisma.transaction.create({
		data: {
			type,
			value,
			system_id,
			sender_id,
			receiver_id,
			hash: '123',
			prev_hash: '123'
		}
	})

	const txPoolQuery = prisma.poolTransaction.delete({
		where: { pool_transaction_id }
	})

	const res = await prisma.$transaction([txQuery, txPoolQuery])
	return res[0]
}
