import { FastifyInstance } from 'fastify'

import { registerSystemHandler } from './system.controller'

const systemRoutes = async (server: FastifyInstance) => {
	server.post('/', registerSystemHandler)
}

export default systemRoutes
