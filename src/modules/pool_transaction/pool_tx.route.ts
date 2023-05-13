import { FastifyInstance } from 'fastify'

import { $ref } from './pool_tx.schema'
import { createPoolTxHandler, getPoolTxsHandler } from './pool_tx.controller'

const poolTxRoutes = async (server: FastifyInstance) => {
	server.post(
		'/',
		{
			schema: {
				body: $ref('createPoolTxSchema'),
				response: { 201: $ref('createPoolTxResponseSchema') }
			}
		},
		createPoolTxHandler
	)

	server.get(
		'/:system_id/',
		{
			preHandler: [server.authenticate],
			schema: {
				response: { 200: $ref('poolTxsResponseSchema') }
			}
		},
		getPoolTxsHandler
	)
}

export default poolTxRoutes
