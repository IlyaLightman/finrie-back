import prisma from '../utils/prisma'

enum SenderType {
	system = 'system',
	user = 'user'
}

export const createSender = async ({
	system_id,
	user_id,
	type
}: {
	system_id: string
	user_id?: string
	type?: SenderType
}) => {
	const sender_type = type || user_id ? SenderType.user : SenderType.system

	return await prisma.sender.create({
		data: {
			type: sender_type,
			system_id,
			user_id
		}
	})
}

export const getUserSender = async (system_id: string, user_id: string) => {
	return await prisma.sender.findFirst({
		where: {
			type: SenderType.user,
			system_id,
			user_id
		}
	})
}

export const getSystemSender = async (system_id: string) => {
	return await prisma.sender.findFirst({
		where: {
			type: SenderType.system,
			system_id
		}
	})
}
