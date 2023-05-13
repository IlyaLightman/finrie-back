import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyPassword } from '../../utils/hash'
import { createUser, findUser, findUsers } from './user.service'
import { CreateUserInput, LoginUserInput } from './user.schema'

import { server } from './../../app'

export const registerUserHandler = async (
	request: FastifyRequest<{ Body: CreateUserInput }>,
	reply: FastifyReply
) => {
	const body = request.body

	try {
		const existing_user = await findUser({
			system_id: body.system_id,
			name: body.name
		})
		if (existing_user) {
			return reply.code(401).send({ message: 'User with this name already exists' })
		}

		const user = await createUser(body)

		return reply.code(201).send(user)
	} catch (err) {
		console.error(err)
		return reply.code(500).send(err)
	}
}

export const loginUserHandler = async (
	request: FastifyRequest<{ Body: LoginUserInput }>,
	reply: FastifyReply
) => {
	const body = request.body

	const user = await findUser({
		system_id: body.system_id,
		name: body.name,
		withPassword: true
	})
	if (!user) {
		return reply.code(401).send({ message: "There isn't user with provided name" })
	}

	const isPasswordCorrect = await verifyPassword(body.password, user.password_hash)
	if (isPasswordCorrect) {
		const { password_hash, ...data } = user
		const toSign = { id: data.user_id, role: 'user' }

		return { accessToken: server.jwt.sign(toSign) }
	}

	return reply.code(401).send({ message: 'The password is incorrect' })
}

export const getUserHandler = async (
	request: FastifyRequest<{ Params: { system_id: string; id: string } }>
) => {
	const user = await findUser({
		system_id: request.params.system_id,
		id: request.params.id
	})
	return user
}

export const getUsersHandler = async (
	request: FastifyRequest<{ Params: { system_id: string } }>
) => {
	const users = await findUsers({ system_id: request.params.system_id })
	return users
}
