import { logger } from '../utils/logger.util'
import { Sequelize } from 'sequelize'

/**
 * @description Class that handles the database, don't instantiate it directly, use the Database.instance
 */
export class Database {
    private DB_USER = process.env.DB_USER ?? ''
    private DB_PASS = process.env.DB_PASS ?? ''
    private DB      = process.env.DB_DATABASE_NAME ?? ''
    private static _instance: Database
    private sequelize: Sequelize;

    private constructor () {
        this.sequelize = new Sequelize(this.DB, this.DB_USER, this.DB_PASS, {
            host: 'localhost',
            dialect: 'mssql'
        });
    }

    public static get instance(): Database {
        return this._instance || ( this._instance = new Database() )
    }

    /**
     * Initialize and test the database
     */
    public async connect(): Promise<void> {
        try {
            await this.sequelize.authenticate()
            console.log( `Connected to SQL SERVER database: ${ this.DB }` )
        } catch (error) {
            logger.error( `${__filename}: ${error}` )
        }
    }

    /**
     * get the current instance of sequelize
     */
    public get connection(): Sequelize {
        return this.sequelize
    }
}