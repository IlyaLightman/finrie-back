import { FastifyInstance } from 'fastify'

import { $ref } from './tx.schema'
import { getTxHandler, getTxsHandler, getTxsUserHandler } from './tx.controller'

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
		'/server',
		{
			preHandler: [server.authenticate, server.checkSystem],
			schema: {
				response: { 200: $ref('txsResponseSchema') }
			}
		},
		getTxsHandler
	)

	server.get(
		'/',
		{
			preHandler: [server.authenticate, server.checkUser],
			schema: {
				response: { 200: $ref('txsResponseSchema') }
			}
		},
		getTxsUserHandler
	)
}

export default txRoute
