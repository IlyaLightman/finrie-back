import { FastifyInstance } from 'fastify'

import { $ref } from './user.schema'
import {
	getAuthUserHandler,
	getUserBalance,
	getUserHandler,
	getUsersHandler,
	loginUserHandler,
	registerUserHandler
} from './user.controller'

const userRoutes = async (server: FastifyInstance) => {
	server.post(
		'/',
		{
			schema: {
				body: $ref('createUserSchema'),
				response: { 201: $ref('createUserResponseSchema') }
			}
		},
		registerUserHandler
	)

	server.post(
		'/login',
		{
			schema: {
				body: $ref('loginUserSchema'),
				response: { 201: $ref('loginUserResponseSchema') }
			}
		},
		loginUserHandler
	)

	server.get(
		'/',
		{
			preHandler: [server.authenticate, server.checkUser],
			schema: {
				response: { 200: $ref('userResponseSchema') }
			}
		},
		getAuthUserHandler
	)

	server.get(
		'/:id',
		{
			preHandler: [server.authenticate],
			schema: {
				response: { 200: $ref('userResponseSchema') }
			}
		},
		getUserHandler
	)

	server.get(
		'/users',
		{
			preHandler: [server.authenticate],
			schema: {
				response: { 200: $ref('usersResponseSchema') }
			}
		},
		getUsersHandler
	)

	server.get(
		'/balance',
		{
			preHandler: [server.authenticate, server.checkUser],
			schema: {
				response: { 200: $ref('userBalanceSchema') }
			}
		},
		getUserBalance
	)
}

export default userRoutes
