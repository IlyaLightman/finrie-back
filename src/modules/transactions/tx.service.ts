import { Sender, Transaction } from '@prisma/client'
import prisma from '../../utils/prisma'
import { getUserReceiver } from '../receiver'
import { getUserSender } from '../sender'

const formTransactions = (transactions: Transaction[], sender: Sender) =>
	transactions.map(tx => ({
		...tx,
		form: tx.sender_id === sender?.sender_id ? 'withdraw' : 'deposit'
	}))

export const getTransaction = async (system_id: string, transaction_id: string) => {
	return await prisma.transaction.findFirst({ where: { system_id, transaction_id } })
}

export const getTransactions = async (system_id: string) => {
	return await prisma.transaction.findMany({
		where: { system_id }
	})
}

export const getUserTransactions = async ({
	system_id,
	user_id,
	created_from,
	created_to
}: {
	system_id: string
	user_id: string
	created_from?: string
	created_to?: string
}) => {
	const sender = await getUserSender(system_id, user_id)
	const receiver = await getUserReceiver(system_id, user_id)

	if (!sender || !receiver) return null

	const transactions = await prisma.transaction.findMany({
		where: {
			system_id,
			OR: [{ sender_id: sender?.sender_id }, { receiver_id: receiver?.receiver_id }],
			created_at: {
				gte: created_from,
				lte: created_to
			}
		}
	})

	return formTransactions(transactions, sender)
}

export const calcUserBalanceByTransactions = async (
	system_id: string,
	user_id: string,
	created_from?: string,
	created_to?: string
): Promise<number> => {
	const sender = await getUserSender(system_id, user_id)
	const receiver = await getUserReceiver(system_id, user_id)

	const aggregateSent = await prisma.transaction.aggregate({
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

	const aggregateReceive = await prisma.transaction.aggregate({
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

	return aggregateReceive._sum.value || 0 - (aggregateSent._sum.value || 0)
}
