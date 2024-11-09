import { Router, Request, Response } from 'express'
import { EAction, HttpResponseUtil } from '../utils/http-responses.util'
import { logger } from '../utils/logger.util'
import { User } from '../models/users/user.model'
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: Router = Router()
const httpResponseUtil: HttpResponseUtil = new HttpResponseUtil()
const resource = 'Auth'

/**
 * @api {post} /auth/ Login a user
 */
router.post('/', async( req: Request, res: Response ): Promise<any> => {
    const { email, pass } = req.body
    if( !process.env.TOKEN_SECRET ) {
        logger.error( `${__filename}: No fue posible obtener el Token` )
        return res.status(500).json(httpResponseUtil.error500(resource, EAction.AUTH, 'Ocurrió un error en el flujo de información'))
    }
    try {
        const user = await User.findOne( { where: { email } } )
        if( !user ) {
            return res.status(401).json(
                httpResponseUtil.success(resource, EAction.AUTH, 'Correo electrónico y/o contraseña inválido', {} )
            )
        }
        const resolvedPass = user.dataValues.pass ?? '';
        if( !compareSync( pass, resolvedPass ) ) {
            return res.status(401).json(
                httpResponseUtil.success(resource, EAction.AUTH, 'Correo electrónico y/o contraseña inválido', {} )
            )
        }
        delete user.dataValues.pass;
        const token = sign( { data: user.dataValues }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_SECRET_EXPIRATION } )
        const payload = { ...user.dataValues, token };
        return res.status(200).json(
            httpResponseUtil.success(resource, EAction.AUTH, 'Autenticación correcta', payload )
        )
        
    } catch (error: any) {
        logger.error( `${__filename}: ${error}` )
        return res.status(500).json(httpResponseUtil.error500(resource, EAction.AUTH, error))
    } finally {
        
    }
})


/**
 * @api {get} /auth verify token
 */
router.get('/', authMiddleware, async( req: Request, res: Response ): Promise<any> => {
    return res.status(200).json(
        httpResponseUtil.success(resource, EAction.AUTH, 'Token válido')
    );

})

export default router