import { FastifyRequest, FastifyReply } from 'fastify'

import { verifyPassword } from '../../utils/hash'
import {
	createSystem,
	findSystem,
	findSystems,
	getCurrentIssuance,
	getCurrentUnregisteredIssuance
} from './system.service'
import { CreateSystemInput, LoginSystemInput } from './system.schema'

import { server } from './../../app'
import { createSender } from '../sender'

export const registerSystemHandler = async (
	request: FastifyRequest<{ Body: CreateSystemInput }>,
	reply: FastifyReply
) => {
	const body = request.body

	try {
		const existing_system = await findSystem({ name: body.name })
		if (existing_system) {
			return reply.code(401).send({ message: 'System with this name already exists' })
		}

		if (body.issuance_restriction === 'unlimited') {
			body.issuance_current_limit = -1
		}

		const system = await createSystem(body)
		await createSender({ system_id: system.system_id })

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

	const system = await findSystem({ name: body.name, withPassword: true })
	if (!system) {
		return reply.code(401).send({ message: "There isn't system with provided name" })
	}

	const isPasswordCorrect = await verifyPassword(body.password, system.password_hash)
	if (isPasswordCorrect) {
		const { password_hash, ...data } = system
		const toSign = { system_id: data.system_id, role: 'system' }

		return { accessToken: server.jwt.sign(toSign) }
	}

	return reply.code(401).send({ message: 'The password is incorrect' })
}

export const getAuthSystemHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const { system_id } = request.user
	const system = await findSystem({ id: system_id })
	if (!system) return reply.code(404).send({ message: 'System not found' })
	return system
}

export const getSystemHandler = async (
	request: FastifyRequest<{ Params: { find: string }; Querystring: { findBy: string } }>,
	reply: FastifyReply
) => {
	const { findBy } = request.query
	const { find } = request.params

	const system = await findSystem({ [findBy === 'name' ? 'name' : 'id']: find })
	if (!system) return reply.code(404).send({ message: 'System not found' })
	return system
}

export const getSystemsHandler = async () => {
	const systems = await findSystems()
	return systems
}

export const getSystemIssuance = async (request: FastifyRequest) => {
	const { system_id } = request.user
	return await getCurrentIssuance(system_id)
}

export const getSystemUnregisteredIssuance = async (request: FastifyRequest) => {
	const { system_id } = request.user
	return await getCurrentUnregisteredIssuance(system_id)
}
