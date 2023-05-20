import prisma from '../../utils/prisma'
import { CreatePoolTxInput } from './pool_tx.schema'

import { getUserReceiver } from '../receiver'
import { getUserSender } from '../sender'
import { PoolTransaction, Sender } from '@prisma/client'

const formPoolTransactions = (transactions: PoolTransaction[], sender: Sender) =>
	transactions.map(tx => ({
		...tx,
		form: tx.sender_id === sender?.sender_id ? 'withdraw' : 'deposit'
	}))

export const createPoolTx = async (input: CreatePoolTxInput) => {
	const poolTx = await prisma.poolTransaction.create({
		data: {
			...input
		}
	})

	return poolTx
}

const findSelect = {
	pool_transaction_id: true,
	type: true,
	value: true,
	system_id: true,
	sender_id: true,
	receiver_id: true,
	status: true,
	created_at: true
}

export const getPoolTx = async (system_id: string, pool_transaction_id: string) => {
	return await prisma.poolTransaction.findFirst({
		where: { system_id, pool_transaction_id },
		select: findSelect
	})
}

export const getPoolTxs = async ({
	system_id,
	sender_id,
	receiver_id
}: {
	system_id: string
	sender_id?: string
	receiver_id?: string
}) => {
	return await prisma.poolTransaction.findMany({
		where: { system_id, sender_id, receiver_id },
		select: findSelect
	})
}

export const getPoolTxsOfUser = async (system_id: string, user_id: string) => {
	const sender = await getUserSender(system_id, user_id)
	const receiver = await getUserReceiver(system_id, user_id)

	if (!sender || !receiver) return null

	const pool_transactions = await prisma.poolTransaction.findMany({
		where: {
			system_id,
			OR: [{ sender_id: sender.sender_id }, { receiver_id: receiver.receiver_id }]
		},
		select: findSelect
	})

	return formPoolTransactions(pool_transactions, sender)
}

export const calcPoolTransactionsSum = async (
	system_id: string,
	user_id: string,
	created_from?: string,
	created_to?: string
): Promise<number> => {
	const sender = await getUserSender(system_id, user_id)
	const receiver = await getUserReceiver(system_id, user_id)

	if (!sender || !receiver) return 0

	const aggregateSent = await prisma.poolTransaction.aggregate({
		where: {
			system_id,
			sender_id: sender?.sender_id,
			created_at: {
				gte: created_from,
				lte: created_to
			}
		},
		_sum: {
			value: true
		}
	})

	const aggregateReceive = await prisma.poolTransaction.aggregate({
		where: {
			system_id,
			receiver_id: receiver?.receiver_id,
			created_at: {
				gte: created_from,
				lte: created_to
			}
		},
		_sum: {
			value: true
		}
	})

	return (aggregateReceive._sum.value || 0) - (aggregateSent._sum.value || 0)
}
