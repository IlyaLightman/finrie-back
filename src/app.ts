import Fastify from 'fastify'

const server = Fastify()

const main = async () => {
    try {
        await server.listen(5000, '0.0.0.0')
        console.log(`Server listening on ${server.server.address()}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

main()
