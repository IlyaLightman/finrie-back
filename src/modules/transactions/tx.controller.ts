import { FastifyRequest, FastifyReply } from 'fastify'
import { getTransaction, getTransactions, getUserTransactions } from './tx.service'

export const getTxHandler = async (request: FastifyRequest<{ Params: { id: string } }>) => {
	const { id } = request.params
	const { system_id } = request.user
	return await getTransaction(system_id, id)
}

export const getTxsHandler = async (request: FastifyRequest) => {
	const { system_id } = request.user
	return await getTransactions(system_id)
}

export const getTxsUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const { system_id, user_id } = request.user
	if (!user_id) return reply.status(400).send({ message: 'user_id is required' })

	return await getUserTransactions({ system_id, user_id })
}
