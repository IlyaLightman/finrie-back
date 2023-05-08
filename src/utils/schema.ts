export const getZodErrObject = (field: string, type: string = 'string') => ({
	required_error: `${field} is required`,
	invalid_type_error: `${field} must be ${type}`
})
