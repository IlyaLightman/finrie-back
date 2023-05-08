import prisma from '../../utils/prisma'
import { CreateSystemInput } from './system.schema'

export const createSystem = async (input: CreateSystemInput) => {
	const system = await prisma.system.create({
		data: input
	})
}
