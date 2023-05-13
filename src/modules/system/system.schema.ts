import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

import { getZodErrObject } from '../../utils/schema'

const systemCommon = {
	name: z.string(getZodErrObject('Name')),
	description: z.string(getZodErrObject('Description')),
	issuance_restriction: z.string(getZodErrObject('Issuance restriction')),
	issuance_current_limit: z.number(getZodErrObject('Issuance current limit', 'number')),
	issuance_rule: z.string(getZodErrObject('Issuance rule')),
	kyc_fields: z.object({}).catchall(z.string())
}

const createSystemSchema = z.object({
	...systemCommon,
	password: z.string()
})

const createSystemResponseSchema = z.object({
	...systemCommon,
	system_id: z.string()
})

const loginSystemSchema = z.object({
	name: z.string(getZodErrObject('Name')),
	password: z.string()
})

const loginSystemResponseSchema = z.object({
	accessToken: z.string()
})

const systemResponseSchema = z.object({
	...systemCommon,
	hash: z.string()
})

const systemsResponseSchema = z.array(systemResponseSchema)

export type CreateSystemInput = z.infer<typeof createSystemSchema>

export type LoginSystemInput = z.infer<typeof loginSystemSchema>

export const { schemas: systemSchemas, $ref } = buildJsonSchemas(
	{
		createSystemSchema,
		createSystemResponseSchema,
		loginSystemSchema,
		loginSystemResponseSchema,
		systemResponseSchema,
		systemsResponseSchema
	},
	{ $id: 'system' }
)
