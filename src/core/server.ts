import express from 'express'
import http from 'http'
import { logger } from '../utils/logger.util'
import cors from 'cors';
import helmet from 'helmet';
/**
 * @description Class that handles the server, don't instantiate it directly, use the Server.instance
 */
export class Server {

    public  app: express.Application
    private static _instance: Server
    private port: number
    private http: http.Server

    private constructor() {
        this.app  = express()
        this.port = Number( process.env.SERVER_PORT )
        this.http = new http.Server( this.app )
    }

    public static get instance(): Server {
        return this._instance || ( this._instance = new Server() )
    }

    /**
     * Initialize the server
     */
    public async start(): Promise<void> {
        try {
            const message = `Server running on port ${ this.port }`
            this.app.use( express.json({ limit: '5mb' }) )
            this.app.use( express.urlencoded({ limit: '5mb', extended: true }) )
            this.app.use(cors());
            this.app.use( helmet({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: ["'self'"],
                        'script-src': ["'self'"]
                    }
                },
                xssFilter: true,
                frameguard: { action: 'deny' },
                noSniff: true,
                xPoweredBy: true
            }))
            this.http.listen( this.port, () => console.log( message ) )
        } catch (error) {
            logger.error( `${__filename}: ${error}` )
        }
    }

        /**
     * get the current instance of http Server (testing propousals)
     */
        public get httpServer(): http.Server {
            return this.http
        }
}
