import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { JsonSchema } from 'fastify-zod'
import fastifyCors from '@fastify/cors'
import fastifySchedule from '@fastify/schedule'

import systemRoutes from './modules/system/system.route'
import userRoutes from './modules/user/user.route'
import poolTxRoutes from './modules/pool_transaction/pool_tx.route'
import txRoutes from './modules/transactions/tx.route'

import { systemSchemas } from './modules/system/system.schema'
import { userSchemas } from './modules/user/user.schema'
import { poolTxSchemas } from './modules/pool_transaction/pool_tx.schema'
import { txSchemas } from './modules/transactions/tx.schema'

import { checkSystem, checkUser } from './utils/decorateChecks'
import { processorJob } from './txProcessor/processor'

enum Role {
	user = 'user',
	system = 'system'
}

export const server = Fastify({
	logger: true
})

declare module 'fastify' {
	interface FastifyRequest {
		jwtVerify: any
		user: {
			id?: string
			role: Role
			system_id: string
			user_id?: string
			iat?: number
		}
	}
	export interface FastifyInstance {
		authenticate: any
		jwt: any
		schedule: any
		checkSystem: any
		checkUser: any
	}
}

server.register(fastifyCors, {
	origin: (origin, cb) => {
		const hostname = new URL(origin || '').hostname

		if (hostname === process.env.CORS_HOSTNAME) return cb(null, true)
		cb(new Error('Not allowed'), false)
	}
})

server.register(fastifySchedule)

server.register(require('@fastify/jwt'), {
	secret: process.env.SECRET
})

server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const ver = await request.jwtVerify()

		if (request.user?.role === Role.user) {
			request.user = {
				system_id: request.user.system_id,
				user_id: request.user.user_id,
				role: Role.user
			}
		} else if (request.user?.role === Role.system) {
			request.user = {
				system_id: request.user.system_id,
				role: Role.system
			}
		}
	} catch (err) {
		return reply.send(err)
	}
})

server.decorate('checkSystem', checkSystem)
server.decorate('checkUser', checkUser)

const addSchemas = (schemas: JsonSchema[]) => schemas.forEach(schema => server.addSchema(schema))

const main = async () => {
	;[systemSchemas, userSchemas, poolTxSchemas, txSchemas].forEach(addSchemas)
	server.register(systemRoutes, { prefix: '/system' })
	server.register(userRoutes, { prefix: '/user' })
	server.register(poolTxRoutes, { prefix: '/pool_tx' })
	server.register(txRoutes, { prefix: '/tx' })

	server.ready().then(() => {
		console.log('Scheduling processor job')
		server.scheduler.addSimpleIntervalJob(processorJob)
	})

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
