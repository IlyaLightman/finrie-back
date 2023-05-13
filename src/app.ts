import Fastify, { FastifyReply, FastifyRequest } from 'fastify'

import systemRoutes from './modules/system/system.route'
import userRoutes from './modules/user/user.route'
import poolTxRoutes from './modules/pool_transaction/pool_tx.route'

import { systemSchemas } from './modules/system/system.schema'
import { userSchemas } from './modules/user/user.schema'
import { poolTxSchemas } from './modules/pool_transaction/pool_tx.schema'

import { findUser } from './modules/user/user.service'
import { findSystem } from './modules/system/system.service'
import { checkSystem, checkUser } from './utils/decorateChecks'

export const server = Fastify()

declare module 'fastify' {
	interface FastifyRequest {
		jwtVerify: any
		user: any
	}
	export interface FastifyInstance {
		authenticate: any
		checkSystem: any
		checkUser: any
		jwt: any
	}
}

server.register(require('@fastify/jwt'), {
	secret: process.env.SECRET
})

server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		await request.jwtVerify()

		if (request.user?.role === 'user') {
			const user = await findUser({
				system_id: request.user.system_id,
				id: request.user.id
			})
			request.user = { ...user, role: 'user' }
		} else if (request.user?.role === 'system') {
			const system = await findSystem({
				id: request.user.system_id
			})
			request.user = { ...system, role: 'system' }
		}
	} catch (err) {
		return reply.send(err)
	}
})

server.decorate('checkSystem', checkSystem)
server.decorate('checkUser', checkUser)

const main = async () => {
	systemSchemas.forEach(schema => server.addSchema(schema))
	userSchemas.forEach(schema => server.addSchema(schema))
	poolTxSchemas.forEach(schema => server.addSchema(schema))
	server.register(systemRoutes, { prefix: '/system' })
	server.register(userRoutes, { prefix: '/user' })
	server.register(poolTxRoutes, { prefix: '/pool_tx' })

	try {
		const host = process.env.ADDRESS || '0.0.0.0'
		const port = Number(process.env.PORT || 3000)
		await server.listen({ port, host })
		console.log(`Server listening on ${host}:${port}`)
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

main()
