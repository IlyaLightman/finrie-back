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

const CreatePoolTxBodySchema = z.object({
	value: z.number(getZodErrObject('Number')),
	receiver_user_id: z.string(getZodErrObject('Receiver User ID'))
})

const CreatePoolTxSchema = z.object({
	...poolTxCommon
})

const CreatePoolTxResponseSchema = z.object({
	...poolTxCommon,
	id: z.string(getZodErrObject('ID'))
})

const poolTxResponseSchema = z.object({
	...poolTxCommon,
	id: z.string(getZodErrObject('ID'))
})

const poolTxsResponseSchema = z.array(poolTxResponseSchema)

export type CreatePoolTxInput = z.infer<typeof CreatePoolTxSchema>
export type CreatePoolTxBodyInput = z.infer<typeof CreatePoolTxBodySchema>

export const { schemas: poolTxSchemas, $ref } = buildJsonSchemas(
	{
		CreatePoolTxSchema,
		CreatePoolTxBodySchema,
		CreatePoolTxResponseSchema,
		poolTxResponseSchema,
		poolTxsResponseSchema
	},
	{ $id: 'pool_tx' }
)
