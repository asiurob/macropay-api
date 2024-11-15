import { DataTypes, Model, Sequelize } from 'sequelize'
import { Database } from '../../core/database'
import { hashSync } from 'bcrypt'

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
            unique: {
                name: 'name_unique',
                msg: 'El nombre ya está registrado',
            },
            validate: {
                notEmpty: {
                    msg: 'El nombre no puede estar vacío'
                },
                notNull: {
                    msg: 'El nombre no puede estar vacío'
                }
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'name_unique',
                msg: 'El apellido ya está registrado'
            },
            validate: {
                notEmpty: {
                    msg: 'El apellido no puede estar vacío'
                },
                notNull: {
                    msg: 'El apellido no puede estar vacío'
                },
            }
        },
        pass: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El password no puede estar vacío'
                },
                notNull: {
                    msg: 'El password no puede estar vacío'
                },
                is: {
                    args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    msg: 'La contraseña no tiene un formato válido'
                }
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'email',
                msg: 'El correo electrónico ya está registrado'
            },
            validate: {
                notEmpty: {
                    msg: 'El correo electrónico no puede estar vacío'
                },
                notNull: {
                    msg: 'El correo electrónico no puede estar vacío'
                },
                isEmail: {
                    msg: 'El correo electrónico no tiene un formato válido'
                }
            }
        },
    },
    {
        hooks: {
            afterValidate: ( user: any ) => {
                if( user.pass ) {
                    user.pass = hashSync( user.pass, 10 );
                }
            }
        }
    }
)

interface User {
    id: number | undefined;
    name: string;
    last_name: string;
    pass?: string;
    email: string;
}
