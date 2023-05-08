import { FastifyRequest, FastifyReply } from 'fastify'
import { createSystem, findSystemByName, findSystems } from './system.service'
import { CreateSystemInput, LoginSystemInput } from './system.schema'
import { verifyPassword } from '../../utils/hash'
import { server } from '../../app'

export const registerSystemHandler = async (
	request: FastifyRequest<{ Body: CreateSystemInput }>,
	reply: FastifyReply
) => {
	const body = request.body

	try {
		const system = await createSystem(body)

		return reply.code(201).send(system)
	} catch (err) {
		console.error(err)
		return reply.code(500).send(err)
	}
}

export const loginSystemHandler = async (
	request: FastifyRequest<{ Body: LoginSystemInput }>,
	reply: FastifyReply
) => {
	const body = request.body

	const system = await findSystemByName(body.name)
	if (!system) return reply.code(401).send({ message: "There isn't system with provided name" })

	const isPasswordCorrect = await verifyPassword(body.password, system.password_hash)
	if (isPasswordCorrect) {
		const { password_hash, ...data } = system
		return { accessToken: server.jwt.sign(data) }
	}

	return reply.code(401).send({ message: 'The password is incorrect' })
}

export const getSystemsHandler = async () => {
	const systems = await findSystems()
	return systems
}
