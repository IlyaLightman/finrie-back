import { FastifyInstance } from 'fastify'

import {
	getSystemHandler,
	getSystemsHandler,
	loginSystemHandler,
	registerSystemHandler
} from './system.controller'
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
		'/:id',
		{
			preHandler: [server.authenticate],
			schema: {
				response: { 200: $ref('systemResponseSchema') }
			}
		},
		getSystemHandler
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
