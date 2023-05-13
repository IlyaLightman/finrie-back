import { FastifyReply, FastifyRequest } from 'fastify'

const checkRole = (role: string) => (request: FastifyRequest, reply: FastifyReply, done: any) => {
	if (!request.user || request.user.role !== role) {
		return reply.code(403).send({ message: `Only for ${role}s` })
	}
	done()
}

export const checkSystem = checkRole('system')
export const checkUser = checkRole('user')
