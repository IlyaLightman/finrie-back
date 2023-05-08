import { hashPassword } from '../../utils/hash'
import prisma from '../../utils/prisma'
import { CreateSystemInput } from './system.schema'

export const createSystem = async (input: CreateSystemInput) => {
	const { password, ...data } = input

	const passwordHash = await hashPassword(password)
	const system = await prisma.system.create({
		data: { ...data, passwordHash }
	})

	return system
}

export const findSystemByName = async (name: string) => {
	return prisma.system.findUnique({ where: { name } })
}

export const findSystems = async () => {
	return prisma.system.findMany({
		select: { name: true }
	})
}
