import { DataTypes, Model, Sequelize } from 'sequelize'
import { Database } from '../../core/database'

const database = Database.instance
const sequelize: Sequelize = database.connection

export const User = sequelize.define<Model<User>>(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        pass: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    }
)

interface User {
    id: number;
    name: string;
    last_name: string;
    pass: string;
    email: string;
}
