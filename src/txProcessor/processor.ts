import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler'

import { processPoolTransactionsToRegister } from './controller'
import { server } from '../app'

const runTxProcessor = async () => {
	console.log('Running pool transactions processor...')

	await processPoolTransactionsToRegister()
}

const processorTask = new AsyncTask(
	'pool_transactions_processor',
	async () => {
		await runTxProcessor()
	},
	err => {
		console.log('Error running pool transactions processor: ', err)
	}
)

export const processorJob = new SimpleIntervalJob({ seconds: 120 }, processorTask)
