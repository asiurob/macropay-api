import { Server } from './core/server'
import { Database } from './core/database'
import UsersRoute from './routes/users/users.route'
import AuthRoute from './routes/auth/auth.route'

const server   = Server.instance
const database = Database.instance

server.start()
database.connect()


server.app.use( '/users', UsersRoute )
server.app.use( '/auth', AuthRoute )
