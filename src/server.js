const Hapi = require('@hapi/hapi')
const routes = require('./routes/book.routes')

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  server.route(routes)
  await server.start()
  console.log(`Server running on ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.error(err.message || 'Something went wrong')
  process.exit()
})

init()
