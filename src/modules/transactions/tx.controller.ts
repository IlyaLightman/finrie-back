import { FastifyRequest } from 'fastify'
import { getTransaction, getTransactions } from './tx.service'

export const getTxHandler = async (request: FastifyRequest<{ Params: { id: string } }>) => {
	const { id } = request.params
	const { system_id } = request.user
	return await getTransaction(system_id, id)
}

export const getTxsHandler = async (request: FastifyRequest) => {
	const { system_id } = request.user
	return await getTransactions(system_id)
}
