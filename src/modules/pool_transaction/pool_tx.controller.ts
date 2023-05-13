import { FastifyRequest, FastifyReply } from 'fastify'

import { CreatePoolTxBodyInput, CreatePoolTxInput } from './pool_tx.schema'

import { createPoolTx } from './pool_tx.service'
import { getUserSender } from '../sender'
import { getSystemSender } from '../sender'
import { getCurrentIssuanceLimit } from '../system/system.service'
import { getUserBalance } from '../../balances'
import { getUserReceiver } from '../receiver'

enum TransactionType {
	issuance = 'issuance',
	transfer = 'transfer'
}

enum PoolTransactionStatus {
	processing = 'processing',
	discarded = 'discarded'
}

const getValidatedPoolTxDataForUser = async (value: number, jwt_user: any, reply: FastifyReply) => {
	const sender = await getUserSender(jwt_user.system_id, jwt_user.user_id)
	if (!sender) return reply.code(401).send({ message: 'No user sender' })

	const balance = await getUserBalance(jwt_user.system_id, jwt_user.user_id)
	if (balance < value) {
		return reply.code(401).send({ message: 'Not enough balance' })
	}

	return {
		type: TransactionType.transfer,
		sender_id: sender.sender_id,
		value: value,
		system_id: jwt_user.system_id,
		status: PoolTransactionStatus.processing
	}
}

const getValidatedPoolTxDataForSystem = async (
	value: number,
	jwt_user: any,
	reply: FastifyReply
) => {
	const sender = await getSystemSender(jwt_user.system_id)
	if (!sender) return reply.code(401).send({ message: 'No system sender' })

	const issuance_limit = await getCurrentIssuanceLimit(jwt_user.system_id)
	if (issuance_limit !== -1 && issuance_limit < value) {
		return reply.code(401).send({ message: 'Not enough free issuance' })
	}

	return {
		type: TransactionType.transfer,
		sender_id: sender.sender_id,
		value: value,
		system_id: jwt_user.system_id,
		status: PoolTransactionStatus.processing
	}
}

export const createPoolTxHandler = async (
	request: FastifyRequest<{ Body: CreatePoolTxBodyInput }>,
	reply: FastifyReply
) => {
	const receiver_user_id = request.body.receiver_user_id
	const jwt_user = request.user

	let data: CreatePoolTxInput | null

	try {
		const receiver_user = await getUserReceiver(jwt_user.system_id, receiver_user_id)
		if (!receiver_user) return reply.code(401).send({ message: 'No receiver for user' })
		const receiver_id = receiver_user.receiver_id

		if (jwt_user.role === 'user') {
			const dataForUser = await getValidatedPoolTxDataForUser(
				request.body.value,
				jwt_user,
				reply
			)
			data = { ...dataForUser, receiver_id }
		} else if (jwt_user.role === 'system') {
			const dataForSystem = await getValidatedPoolTxDataForSystem(
				request.body.value,
				jwt_user,
				reply
			)
			data = { ...dataForSystem, receiver_id }
		} else return reply.code(401).send({ message: 'Unavailable token' })

		return await createPoolTx(data)
	} catch (err) {
		console.error(err)
		return reply.code(500).send(err)
	}
}
