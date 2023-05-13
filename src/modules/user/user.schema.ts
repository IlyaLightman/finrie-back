import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import { getZodErrObject } from '../../utils/schema'

const userCommon = {
	name: z.string(getZodErrObject('Name')),
	system_id: z.string(getZodErrObject('System ID')),
	kyc_data: z.object({}).catchall(z.string()),
	status: z.string(getZodErrObject('Status'))
}

const createUserSchema = z.object({
	...userCommon,
	password: z.string()
})

const createUserResponseSchema = z.object({
	...userCommon,
	user_id: z.string()
})

const loginUserSchema = z.object({
	system_id: z.string(getZodErrObject('System ID')),
	name: z.string(getZodErrObject('Name')),
	password: z.string()
})

const loginUserResponseSchema = z.object({
	accessToken: z.string()
})

const userResponseSchema = z.object({
	...userCommon
})

const usersResponseSchema = z.array(userResponseSchema)

export type CreateUserInput = z.infer<typeof createUserSchema>

export type LoginUserInput = z.infer<typeof loginUserSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
	{
		createUserSchema,
		createUserResponseSchema,
		loginUserSchema,
		loginUserResponseSchema,
		userResponseSchema,
		usersResponseSchema
	},
	{ $id: 'user' }
)
