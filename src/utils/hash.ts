import bcrypt from 'bcrypt'

export const hashPassword = async (password: string, saltRounds: number = 3) =>
	await bcrypt.hash(password, saltRounds)

export const verifyPassword = async (password: string, hash: string | undefined) =>
	hash ? await bcrypt.compare(password, hash) : false
