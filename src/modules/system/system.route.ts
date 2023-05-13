import { FastifyInstance } from 'fastify'

import { $ref } from './system.schema'
import {
	getSystemHandler,
	getSystemsHandler,
	loginSystemHandler,
	registerSystemHandler
} from './system.controller'

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
