import prisma from '../../utils/prisma'
import { hashPassword } from '../../utils/hash'
import { CreateSystemInput } from './system.schema'
import { calcSystemDistributionByTransactions } from '../transactions/tx.service'
import { calcPoolTransactionsSystemDistribution } from '../pool_transaction/pool_tx.service'

export const createSystem = async (input: CreateSystemInput) => {
	const { password, issuance_current_limit, ...data } = input

	const passwordHash = await hashPassword(password)

	const system = await prisma.system.create({
		data: {
			...data,
			issuance_current_limit:
				issuance_current_limit === undefined ? -1 : issuance_current_limit,
			password_hash: passwordHash,
			hash: '123' // todo: hashing of system
		}
	})

	return system
}

const findSelect = {
	system_id: true,
	name: true,
	description: true,
	issuance_restriction: true,
	issuance_current_limit: true,
	issuance_rule: true,
	created_at: true,
	hash: true
}

export const findSystem = async ({
	name,
	id,
	withPassword = false
}: {
	name?: string
	id?: string
	withPassword?: boolean
}) => {
	return await prisma.system.findFirst({
		where: name ? { name } : { system_id: id },
		select: { ...findSelect, ...(withPassword ? { password_hash: true } : {}) }
	})
}

export const findSystems = async () => {
	return await prisma.system.findMany({
		select: findSelect
	})
}

const getSystemIssuanceCurrentLimit = async (system_id: string) => {
	const system = await prisma.system.findFirst({
		where: { system_id },
		select: { issuance_current_limit: true }
	})
	if (!system) return 0
	return system.issuance_current_limit
}

export const getCurrentIssuance = async (system_id: string) => {
	const current_limit = await getSystemIssuanceCurrentLimit(system_id)
	if (current_limit === -1) return -1

	const tx_distribution = await calcSystemDistributionByTransactions(system_id)
	return current_limit - tx_distribution
}

export const getCurrentUnregisteredIssuance = async (system_id: string) => {
	const current_limit = await getSystemIssuanceCurrentLimit(system_id)
	if (current_limit === -1) return -1

	const tx_distribution = await calcSystemDistributionByTransactions(system_id)
	const pool_tx_distribution = await calcPoolTransactionsSystemDistribution(system_id)
	return current_limit - tx_distribution - pool_tx_distribution
}
