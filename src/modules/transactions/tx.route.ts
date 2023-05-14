import { FastifyInstance } from 'fastify'

import { $ref } from './tx.schema'
import { getTxHandler, getTxsHandler } from './tx.controller'

const txRoute = async (server: FastifyInstance) => {
	server.get(
		'/:id',
		{
			preHandler: [server.authenticate],
			schema: {
				response: { 200: $ref('txResponseSchema') }
			}
		},
		getTxHandler
	)

	server.get(
		'/',
		{
			preHandler: [server.authenticate],
			schema: {
				response: { 200: $ref('txsResponseSchema') }
			}
		},
		getTxsHandler
	)
}

export default txRoute
