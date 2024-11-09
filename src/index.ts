import { Server } from './core/server'
import { Database } from './core/database'

const server   = Server.instance
const database = Database.instance

server.start()
database.connect()