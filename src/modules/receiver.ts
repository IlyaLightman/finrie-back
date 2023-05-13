import prisma from '../utils/prisma'

enum ReceiverType {
	user = 'user'
}

export const createReceiver = async ({
	system_id,
	user_id
}: {
	system_id: string
	user_id: string
}) => {
	return await prisma.receiver.create({
		data: {
			type: ReceiverType.user,
			system_id,
			user_id
		}
	})
}

export const getUserReceiver = async (system_id: string, user_id: string) => {
	return await prisma.receiver.findFirst({
		where: {
			type: ReceiverType.user,
			system_id,
			user_id
		}
	})
}
