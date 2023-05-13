import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

import { getZodErrObject } from '../../utils/schema'

const poolTxCommon = {
	type: z.enum(['issuance', 'transfer'], getZodErrObject('Type')),
	value: z.number(getZodErrObject('Number')),
	system_id: z.string(getZodErrObject('System ID')),
	sender_id: z.string(getZodErrObject('Sender ID')),
	receiver_id: z.string(getZodErrObject('Receiver ID')),
	status: z.enum(['processing', 'discarded'], getZodErrObject('Status'))
}

const createPoolTxBodySchema = z.object({
	value: z.number(getZodErrObject('Number')),
	receiver_user_id: z.string(getZodErrObject('Receiver User ID'))
})

const createPoolTxSchema = z.object({
	...poolTxCommon
})

const createPoolTxResponseSchema = z.object({
	...poolTxCommon,
	id: z.string(getZodErrObject('ID'))
})

const poolTxResponseSchema = z.object({
	...poolTxCommon,
	id: z.string(getZodErrObject('ID'))
})

const poolTxsResponseSchema = z.array(poolTxResponseSchema)

export type CreatePoolTxInput = z.infer<typeof createPoolTxSchema>
export type CreatePoolTxBodyInput = z.infer<typeof createPoolTxBodySchema>

export const { schemas: poolTxSchemas, $ref } = buildJsonSchemas(
	{
		createPoolTxSchema,
		createPoolTxBodySchema,
		createPoolTxResponseSchema,
		poolTxResponseSchema,
		poolTxsResponseSchema
	},
	{ $id: 'pool_tx' }
)
