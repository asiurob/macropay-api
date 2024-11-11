import { Server } from './core/server'
import { Database } from './core/database'
import UsersRoute from './routes/users/users.route'
import AuthRoute from './routes/auth/auth.route'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

const swaggerDocument = yaml.load('./swagger.yaml');

const server   = Server.instance
const database = Database.instance

server.start()
database.connect()


server.app.use( '/users', UsersRoute )
server.app.use( '/auth', AuthRoute )
server.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
