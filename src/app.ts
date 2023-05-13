import Fastify, { FastifyReply, FastifyRequest } from 'fastify'

import systemRoutes from './modules/system/system.route'
import userRoutes from './modules/user/user.route'
import { systemSchemas } from './modules/system/system.schema'
import { userSchemas } from './modules/user/user.schema'

export const server = Fastify()

declare module 'fastify' {
	interface FastifyRequest {
		jwtVerify: any
	}
	export interface FastifyInstance {
		authenticate: any
		jwt: any
	}
}

server.register(require('@fastify/jwt'), {
	secret: process.env.SECRET
})

server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		await request.jwtVerify()
	} catch (err) {
		return reply.send(err)
	}
})

const main = async () => {
	systemSchemas.forEach(schema => server.addSchema(schema))
	userSchemas.forEach(schema => server.addSchema(schema))
	server.register(systemRoutes, { prefix: '/system' })
	server.register(userRoutes, { prefix: '/user' })

	try {
		const address = process.env.ADDRESS || '0.0.0.0'
		const port = process.env.PORT || 3000
		await server.listen(port, address)
		console.log(`Server listening on ${address}:${port}`)
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

main()
