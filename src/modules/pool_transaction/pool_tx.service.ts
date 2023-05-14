import prisma from '../../utils/prisma'
import { CreatePoolTxInput } from './pool_tx.schema'

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
	return await prisma.poolTransaction.findMany({
		where: { system_id, OR: [{ sender_id: user_id }, { receiver_id: user_id }] },
		select: findSelect
	})
}
