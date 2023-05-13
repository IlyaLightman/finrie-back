import { getUserReceiver } from './modules/receiver'
import { getUserSender } from './modules/sender'

export const getUserBalance = async (system_id: string, user_id: string) => {
	const sender = await getUserSender(system_id, user_id)
	const receiver = await getUserReceiver(system_id, user_id)

	// todo: calc all transactions + weekly_statements
	return 0
}
