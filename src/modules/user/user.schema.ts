import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

import { getZodErrObject } from '../../utils/schema'

const userCommon = {
	name: z.string(getZodErrObject('Name')),
	system_id: z.string(getZodErrObject('System ID'))
}

const createUserSchema = z.object({
	...userCommon,
	password: z.string()
})

const createUserRequestSchema = z.object({
	system_name: z.string(getZodErrObject('System name')),
	name: z.string(getZodErrObject('Name')),
	password: z.string()
})

const createUserResponseSchema = z.object({
	...userCommon,
	user_id: z.string()
})

const loginUserSchema = z.object({
	...userCommon,
	password: z.string()
})

const loginUserRequestSchema = z.object({
	system_name: z.string(getZodErrObject('System name')),
	name: z.string(getZodErrObject('Name')),
	password: z.string()
})

const loginUserResponseSchema = z.object({
	accessToken: z.string()
})

const userResponseSchema = z.object({
	...userCommon,
	system_name: z.string(),
	user_id: z.string()
})

const usersResponseSchema = z.array(userResponseSchema)

const userBalanceSchema = z.number()

export type CreateUserInput = z.infer<typeof createUserSchema>
export type CreateUserRequestInput = z.infer<typeof createUserRequestSchema>

export type LoginUserInput = z.infer<typeof loginUserSchema>
export type LoginUserRequestSchema = z.infer<typeof loginUserRequestSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
	{
		createUserSchema,
		createUserRequestSchema,
		createUserResponseSchema,
		loginUserSchema,
		loginUserRequestSchema,
		loginUserResponseSchema,
		userResponseSchema,
		usersResponseSchema,
		userBalanceSchema
	},
	{ $id: 'user' }
)
