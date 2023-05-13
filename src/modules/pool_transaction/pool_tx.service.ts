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

export const findPoolTxs = async ({
	system_id,
	sender_id,
	receiver_id
}: {
	system_id: string
	sender_id?: string
	receiver_id?: string
}) => {
	return prisma.poolTransaction.findMany({
		where: { system_id, sender_id, receiver_id },
		select: findSelect
	})
}
