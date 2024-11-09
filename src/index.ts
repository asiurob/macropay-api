import { Server } from './core/server'
import { Database } from './core/database'
import UsersRoute from './routes/users.route'

const server   = Server.instance
const database = Database.instance

server.start()
database.connect()


server.app.use( '/users', UsersRoute )