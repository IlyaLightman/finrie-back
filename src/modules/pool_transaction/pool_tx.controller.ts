import { FastifyRequest, FastifyReply } from 'fastify'

import { CreatePoolTxBodyInput, CreatePoolTxInput } from './pool_tx.schema'
import { PoolTransactionStatus, TransactionType } from '@prisma/client'

import { createPoolTx, getPoolTxsOfUser, getPoolTx } from './pool_tx.service'
import { getUserSender } from '../sender'
import { getSystemSender } from '../sender'
import { getCurrentIssuance } from '../system/system.service'
import { getUserUnregisteredBalance } from '../../balances'
import { getUserReceiver } from '../receiver'
import { getPoolTxs } from './pool_tx.service'

const getValidatedPoolTxDataForUser = async (
	request: FastifyRequest<{ Body: CreatePoolTxBodyInput }>,
	jwt_user: any
) => {
	if (request.body.receiver_user_id === jwt_user.user_id) {
		return { error: 'Cannot send to yourself' }
	}

	const value = request.body.value

	const sender = await getUserSender(jwt_user.system_id, jwt_user.user_id)
	if (!sender) return { error: 'No user sender' }

	const balance = await getUserUnregisteredBalance(jwt_user.system_id, jwt_user.user_id)
	if (balance < value) {
		return { error: 'Not enough balance' }
	}

	return {
		data: {
			type: TransactionType.transfer,
			sender_id: sender.sender_id,
			value: value,
			system_id: jwt_user.system_id,
			status: PoolTransactionStatus.processing
		}
	}
}

const getValidatedPoolTxDataForSystem = async (
	request: FastifyRequest<{ Body: CreatePoolTxBodyInput }>,
	jwt_user: any
) => {
	const value = request.body.value

	const sender = await getSystemSender(jwt_user.system_id)
	if (!sender) return { error: 'No system sender' }

	const issuance_limit = await getCurrentIssuance(jwt_user.system_id)
	if (issuance_limit !== -1 && issuance_limit < value) {
		return { error: 'Not enough free issuance' }
	}

	return {
		data: {
			type: TransactionType.issuance,
			sender_id: sender.sender_id,
			value: value,
			system_id: jwt_user.system_id,
			status: PoolTransactionStatus.processing
		}
	}
}

export const createPoolTxHandler = async (
	request: FastifyRequest<{ Body: CreatePoolTxBodyInput }>,
	reply: FastifyReply
) => {
	const receiver_user_id = request.body.receiver_user_id
	const jwt_user = request.user

	let data: CreatePoolTxInput

	try {
		if (request.body.value <= 0) return reply.code(401).send({ message: 'Invalid value' })

		const receiver_user = await getUserReceiver(jwt_user.system_id, receiver_user_id)
		if (!receiver_user) return reply.code(401).send({ message: 'No receiver for user' })
		const receiver_id = receiver_user.receiver_id

		console.log(jwt_user)
		if (jwt_user.role === 'user') {
			const dataForUser = await getValidatedPoolTxDataForUser(request, jwt_user)
			if (!dataForUser.data) return reply.code(401).send({ message: dataForUser.error })
			data = { ...dataForUser.data, receiver_id }
		} else if (jwt_user.role === 'system') {
			const dataForSystem = await getValidatedPoolTxDataForSystem(request, jwt_user)
			if (!dataForSystem.data) return reply.code(401).send({ message: dataForSystem.error })
			data = { ...dataForSystem.data, receiver_id }
		} else return reply.code(401).send({ message: 'Unavailable token' })

		return await createPoolTx(data)
	} catch (err) {
		console.error(err)
		return reply.code(500).send(err)
	}
}

export const getPoolTxHandler = async (request: FastifyRequest<{ Params: { id: string } }>) => {
	const { id } = request.params
	const { system_id } = request.user
	return await getPoolTx(system_id, id)
}

export const getPoolTxsHandler = async (request: FastifyRequest) => {
	const { system_id } = request.user
	return await getPoolTxs({ system_id })
}

export const getPoolTxsOfUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const { system_id, user_id } = request.user
	if (!user_id) return reply.status(400).send({ message: 'user_id is required' })

	return await getPoolTxsOfUser(system_id, user_id)
}
