import { z } from 'zod'

const createSystemSchema = z.object({
	name: z.string({
		required_error: 'Name is required',
		invalid_type_error: 'Name must be a string'
	})
})

export type CreateSystemInput = z.infer<typeof createSystemSchema>
