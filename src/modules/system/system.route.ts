import { FastifyInstance } from 'fastify'

import { $ref } from './system.schema'
import {
	getAuthSystemHandler,
	getSystemHandler,
	getSystemIssuance,
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
		'/',
		{
			preHandler: [server.authenticate, server.checkSystem],
			schema: {
				response: { 200: $ref('systemResponseSchema') }
			}
		},
		getAuthSystemHandler
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
		'/systems',
		{
			preHandler: [server.authenticate],
			schema: {
				response: { 200: $ref('systemsResponseSchema') }
			}
		},
		getSystemsHandler
	)

	server.get(
		'/issuance',
		{
			preHandler: [server.authenticate],
			schema: {
				response: { 200: $ref('systemIssuanceSchema') }
			}
		},
		getSystemIssuance
	)
}

export default systemRoutes
