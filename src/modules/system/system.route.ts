import { FastifyInstance } from 'fastify'

import { getSystemsHandler, loginSystemHandler, registerSystemHandler } from './system.controller'
import { $ref } from './system.schema'

const systemRoutes = async (server: FastifyInstance) => {
	server.post(
		'/',
		{
			schema: {
				body: $ref('createSystemSchema'),
				response: { 201: $ref('createSystemResponseSchema') }
			}
		},
		registerSystemHandler
	)

	server.post(
		'/login',
		{
			schema: {
				body: $ref('loginSystemSchema'),
				response: { 201: $ref('loginSystemResponseSchema') }
			}
		},
		loginSystemHandler
	)

	server.get(
		'/',
		{
			preHandler: [server.authenticate],
			schema: {
				response: { 200: $ref('systemsResponseSchema') }
			}
		},
		getSystemsHandler
	)
}

export default systemRoutes
