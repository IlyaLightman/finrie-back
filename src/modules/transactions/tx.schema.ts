import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

import { getZodErrObject } from '../../utils/schema'

const txCommon = {
	transaction_id: z.string(getZodErrObject('Transaction ID')),
	type: z.enum(['issuance', 'transfer'], getZodErrObject('Type')),
	value: z.number(getZodErrObject('Number')),
	system_id: z.string(getZodErrObject('System ID')),
	sender_id: z.string(getZodErrObject('Sender ID')),
	receiver_id: z.string(getZodErrObject('Receiver ID')),
	created_at: z.string(getZodErrObject('Created At')),
	hash: z.string(getZodErrObject('Hash')),
	prev_hash: z.string(getZodErrObject('Previous Hash'))
}

const txResponseSchema = z.object({
	...txCommon,
	transaction_id: z.string().optional(),
	form: z.string().optional(),
	created_at: z.string()
})

const txsResponseSchema = z.array(txResponseSchema)

export const { schemas: txSchemas, $ref } = buildJsonSchemas(
	{
		txResponseSchema,
		txsResponseSchema
	},
	{ $id: 'tx' }
)
