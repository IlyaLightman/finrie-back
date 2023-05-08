import { hashPassword } from '../../utils/hash'
import prisma from '../../utils/prisma'
import { CreateSystemInput } from './system.schema'

export const createSystem = async (input: CreateSystemInput) => {
	const { password, ...data } = input

	const passwordHash = await hashPassword(password)
	const system = await prisma.system.create({
		data: {
			...data,
			password_hash: passwordHash,
			hash: '123' // todo: hashing of system
		}
	})

	return system
}

const findSelect = {
	name: true,
	description: true,
	issuance_restriction: true,
	issuance_current_limit: true,
	issuance_rule: true,
	kyc_fields: true,
	hash: true
}

export const findSystem = async ({ name, id }: { name?: string; id?: string }) => {
	return prisma.system.findUnique({
		where: name ? { name } : { system_id: id },
		select: findSelect
	})
}

export const findSystems = async () => {
	return prisma.system.findMany({
		select: findSelect
	})
}
