import { FastifyInstance } from 'fastify'

import { $ref } from './pool_tx.schema'
import {
	createPoolTxHandler,
	getPoolTxsHandler,
	getPoolTxsOfUserHandler
} from './pool_tx.controller'

const poolTxRoutes = async (server: FastifyInstance) => {
	server.post(
		'/',
		{
			preHandler: [server.authenticate],
			schema: {
				body: $ref('createPoolTxSchema'),
				response: { 201: $ref('createPoolTxResponseSchema') }
			}
		},
		createPoolTxHandler
	)

	server.get(
		'/system',
		{
			preHandler: [server.authenticate, server.checkSystem],
			schema: {
				response: { 200: $ref('poolTxsResponseSchema') }
			}
		},
		getPoolTxsHandler
	)

	server.get(
		'/',
		{
			preHandler: [server.authenticate, server.checkUser],
			schema: {
				response: { 200: $ref('poolTxsResponseSchema') }
			}
		},
		getPoolTxsOfUserHandler
	)
}

export default poolTxRoutes
