import prisma from '../../utils/prisma'
import { hashPassword } from '../../utils/hash'
import { CreateUserInput } from './user.schema'

export const createUser = async (input: CreateUserInput) => {
	const { password, ...data } = input

	const passwordHash = await hashPassword(password)
	const user = await prisma.user.create({
		data: {
			...data,
			password_hash: passwordHash
		}
	})

	return user
}

const findSelect = {
	user_id: true,
	name: true,
	system_id: true,
	kyc_data: true,
	status: true,
	registered_at: true
}

export const findUser = async ({
	system_id,
	name,
	id,
	withPassword = false
}: {
	system_id: string
	name?: string
	id?: string
	withPassword?: boolean
}) => {
	return await prisma.user.findFirst({
		where: name ? { system_id, name } : { system_id, user_id: id },
		select: { ...findSelect, ...(withPassword ? { password_hash: true } : {}) }
	})
}

export const findUsers = async ({ system_id }: { system_id: string }) => {
	return await prisma.user.findMany({
		where: { system_id },
		select: findSelect
	})
}
