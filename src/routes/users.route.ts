import { Router, Request, Response } from 'express'
import { EAction, HttpResponseUtil } from '../utils/http-responses.util'
import { logger } from '../utils/logger.util'
import { EmailMatcher, PassMatcher } from '../utils/regex-matcher.util'
import { User } from '../models/users/user.model'
import { hashSync } from 'bcrypt'

const router: Router = Router()
const httpResponseUtil: HttpResponseUtil = new HttpResponseUtil()
const resource = 'usuario'

/**
 * @api {post} /users/ Create a new user
 */
router.post('/', async( req: Request, res: Response ): Promise<any> => {
    const { email, name, last_name, pass } = req.body
    const validEmail = EmailMatcher( email );
    const validPass  = PassMatcher( pass );
    if( !validEmail ) {
        return res.status(400).json(
            httpResponseUtil.error400(resource, EAction.CREATE, 'El correo electrónico no tiene un formato válido')
        )
    }
    if( !validPass ) {
        return res.status(400).json(
            httpResponseUtil.error400(resource, EAction.CREATE, 'La contraseña no tiene un formato válido')
        )
    }  

    try {
        const user = (await User.create({ email, name, last_name, pass: hashSync(pass, 10) })).toJSON();
        delete user.pass;
        return res.status(201).json(
            httpResponseUtil.create(resource, user, EAction.CREATE)
        )
    } catch (error: any) {
        console.log( error );
        logger.error( `${__filename}: ${error}` )
        return res.status(500).json(httpResponseUtil.error500(resource, EAction.CREATE, error))
    }
})

/**
 * @api {put} /users/id Update an user 
 */
router.put('/:id', async( req: Request, res: Response ): Promise<any> => {

    try {
        return res.status(200).json(
            httpResponseUtil.success(resource, EAction.UPDATE)
        )
    } catch (error: any) {
        logger.error( `${__filename}: ${error}` )
        return res.status(500).json(httpResponseUtil.error500(resource, EAction.UPDATE, error))
    }
})

/**
 * @api {get} /users/single/id Get one user 
 */
router.get('/single/:id', async( req: Request, res: Response ): Promise<any> => {
    const id = req.params.id
    try {

        return res.status(200).json(
            httpResponseUtil.success(resource, EAction.READ, '', {})
        )
    } catch( error: any ) {
        logger.error( `${__filename}: ${error}` )
        return res.status(500).json(httpResponseUtil.error500(resource, EAction.READ, error))
    }
})

/**
 * @api {get} /users/list Get all users
 */
router.get('/list', async( req: Request, res: Response ): Promise<any> => {

    try {
        return res.status(200).json(
            httpResponseUtil.success(resource, EAction.READ, '', {})
        )
    } catch( error: any ) {
        logger.error( `${__filename}: ${error}` )
        return res.status(500).json(httpResponseUtil.error500(resource, EAction.READ, error))
    }
})

/**
 * @api {delete} /users/id Delete one user
 */
router.delete('/:id', async( req: Request, res: Response ): Promise<any> => {

    try {
        return res.status(200).json(
            httpResponseUtil.success(resource, EAction.DELETE, '', {})
        )
    } catch( error: any ) {
        logger.error( `${__filename}: ${error}` )
        return res.status(500).json(httpResponseUtil.error500(resource, EAction.DELETE, error))
    }
})

export default router