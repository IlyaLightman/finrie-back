import prisma from '../../utils/prisma'
import { PoolTransaction, PoolTransactionStatus, Sender } from '@prisma/client'

import { CreatePoolTxInput } from './pool_tx.schema'
import { getUserReceiver } from '../receiver'
import { getSystemSender, getUserSender } from '../sender'

interface poolTransactionUserName {
	user: {
		name: string
	} | null
}

const formPoolTransactions = (
	transactions: (PoolTransaction & {
		sender: poolTransactionUserName
		receiver: poolTransactionUserName
	})[],
	sender: Sender
) =>
	transactions.map(tx => ({
		...tx,
		form: tx.sender_id === sender?.sender_id ? 'withdraw' : 'deposit',
		receiver_name: tx.receiver?.user?.name,
		sender_name: tx.sender?.user?.name
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
		select: findSelect,
		orderBy: { created_at: 'desc' }
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
		select: {
			...findSelect,
			sender: { select: { user: { select: { name: true } } } },
			receiver: { select: { user: { select: { name: true } } } }
		},
		orderBy: { created_at: 'desc' }
	})

	return formPoolTransactions(pool_transactions, sender)
}

export const calcPoolTransactionsUserSum = async (
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
			},
			status: PoolTransactionStatus.processing
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
			},
			status: PoolTransactionStatus.processing
		},
		_sum: {
			value: true
		}
	})

	return (aggregateReceive._sum.value || 0) - (aggregateSent._sum.value || 0)
}

export const calcPoolTransactionsSystemDistribution = async (
	system_id: string,
	created_from?: string,
	created_to?: string
): Promise<number> => {
	const sender = await getSystemSender(system_id)

	if (!sender) return 0

	const aggregateSent = await prisma.poolTransaction.aggregate({
		where: {
			system_id,
			created_at: {
				gte: created_from,
				lte: created_to
			},
			sender_id: sender.sender_id,
			status: PoolTransactionStatus.processing
		},
		_sum: {
			value: true
		}
	})

	return aggregateSent._sum.value || 0
}
