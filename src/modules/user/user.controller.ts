import { FastifyRequest, FastifyReply } from 'fastify'

import { verifyPassword } from '../../utils/hash'
import { createUser, findUser, findUsers } from './user.service'
import { CreateUserRequestInput, LoginUserRequestSchema } from './user.schema'
import { createSender } from '../sender'
import { createReceiver } from '../receiver'
import { getUserBalance as getBalance } from '../../balances'

import { server } from './../../app'
import { findSystem } from '../system/system.service'

export const registerUserHandler = async (
	request: FastifyRequest<{ Body: CreateUserRequestInput }>,
	reply: FastifyReply
) => {
	const body = request.body

	try {
		const existing_user = await findUser({
			system_name: body.system_name,
			name: body.name
		})
		if (existing_user) {
			return reply.code(401).send({ message: 'User with this name already exists' })
		}

		const system = await findSystem({ name: body.system_name })
		if (!system) {
			return reply.code(401).send({ message: "There isn't system with provided name" })
		}

		const user = await createUser({
			system_id: system.system_id,
			name: body.name,
			password: body.password
		})
		await createSender({ system_id: user.system_id, user_id: user.user_id })
		await createReceiver({ system_id: user.system_id, user_id: user.user_id })

		return reply.code(201).send(user)
	} catch (err) {
		console.error(err)
		return reply.code(500).send(err)
	}
}

export const loginUserHandler = async (
	request: FastifyRequest<{ Body: LoginUserRequestSchema }>,
	reply: FastifyReply
) => {
	const body = request.body

	const user = await findUser({
		system_name: body.system_name,
		name: body.name,
		withPassword: true
	})
	if (!user) {
		return reply.code(401).send({ message: "There isn't user with provided name" })
	}

	const isPasswordCorrect = await verifyPassword(body.password, user.password_hash)
	if (isPasswordCorrect) {
		const { password_hash, ...data } = user
		const toSign = {
			system_id: data.system_id,
			user_id: data.user_id,
			role: 'user'
		}

		return { accessToken: server.jwt.sign(toSign) }
	}

	return reply.code(401).send({ message: 'The password is incorrect' })
}

export const getAuthUserHandler = async (request: FastifyRequest) => {
	const { system_id, user_id } = request.user
	const system = await findSystem({ id: system_id })
	const user = await findUser({
		system_id,
		id: user_id
	})

	if (!user || !system) return null

	return { ...user, system_name: system.name }
}

export const getUserHandler = async (
	request: FastifyRequest<{ Params: { find: string }; Querystring: { findBy: string } }>
) => {
	const { system_id } = request.user
	const { findBy } = request.query
	const { find } = request.params

	const user = await findUser({
		system_id,
		[findBy === 'name' ? 'name' : 'id']: find
	})
	return user
}

export const getUsersHandler = async (request: FastifyRequest) => {
	const { system_id } = request.user
	const users = await findUsers({ system_id })
	return users
}

export const getUserBalance = async (request: FastifyRequest, reply: FastifyReply) => {
	const { system_id, user_id } = request.user
	if (!system_id || !user_id) return reply.code(401).send({ message: 'Unavailable JWT' })
	const balance = await getBalance(system_id, user_id)
	return balance
}
