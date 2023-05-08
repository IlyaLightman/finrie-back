import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const systemCommon = {
	name: z.string({
		required_error: 'Name is required',
		invalid_type_error: 'Name must be a string'
	})
}

const createSystemSchema = z.object({
	...systemCommon,
	password: z.string()
})

const createSystemResponseSchema = z.object({
	...systemCommon,
	id: z.string()
})

const loginSystemSchema = z.object({
	name: z.string({
		required_error: 'Name is required',
		invalid_type_error: 'Name must be a string'
	}),
	password: z.string()
})

const loginSystemResponseSchema = z.object({
	accessToken: z.string()
})

const systemResponseSchema = z.object({
	...systemCommon
})

const systemsResponseSchema = z.array(systemResponseSchema)

export type CreateSystemInput = z.infer<typeof createSystemSchema>

export type LoginSystemInput = z.infer<typeof loginSystemSchema>

export const { schemas: systemSchemas, $ref } = buildJsonSchemas({
	createSystemSchema,
	createSystemResponseSchema,
	loginSystemSchema,
	loginSystemResponseSchema,
	systemsResponseSchema
})
