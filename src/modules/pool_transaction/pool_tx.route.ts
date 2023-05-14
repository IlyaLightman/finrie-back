import { FastifyInstance } from 'fastify'

import { $ref } from './pool_tx.schema'
import {
	createPoolTxHandler,
	getPoolTxHandler,
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
		'/:id',
		{
			preHandler: [server.authenticate],
			schema: {
				response: { 200: $ref('poolTxResponseSchema') }
			}
		},
		getPoolTxHandler
	)

	server.get(
		'/system',
		{
			preHandler: [server.authenticate],
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
