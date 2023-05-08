import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fastifyJwt from '@fastify/jwt'

import systemRoutes from './modules/system/system.route'
import { systemSchemas } from './modules/system/system.schema'

export const server = Fastify()

declare module 'fastify' {
	export interface FastifyInstance {
		authenticate: any
	}
}

server.register(fastifyJwt, {
	secret: () => process.env.SECRET
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
	server.register(systemRoutes, { prefix: '/system' })

	try {
		await server.listen(5000, '0.0.0.0')
		console.log(`Server listening on ${server.server.address()}`)
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

main()
