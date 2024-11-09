import { Router, Request, Response } from 'express'
import { EAction, HttpResponseUtil } from '../utils/http-responses.util'
import { logger } from '../utils/logger.util'
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

    try {
        const user = (await User.create({ email, name, last_name, pass: hashSync(pass, 10) })).toJSON();
        delete user.pass;
        return res.status(201).json(
            httpResponseUtil.create(resource, user, EAction.CREATE)
        )
    } catch (error: any) {
        logger.error( `${__filename}: ${error}` )
        return res.status(500).json(httpResponseUtil.error500(resource, EAction.CREATE, error))
    }
})

/**
 * @api {put} /users/id Update an user 
 */
router.put('/:id', async( req: Request, res: Response ): Promise<any> => {
    const id = req.params.id
    const updateElements: any = {};
    ['email', 'name', 'last_name', 'pass'].forEach( e => {
        const key = req.body[e];
        if( key ) {
            updateElements[e] = key;
        }
    });

    try {
        const result = await User.update( { ...updateElements }, { where: { id } } );
        const message = result[0] === 1 ? 'Se actualizó correctamente la información' : 'El usuario no fue identificado, inténtalo nuevamente';
        return res.status(200).json(
            httpResponseUtil.success(resource, message )
        )
    } catch (error: any) {
        logger.error( `${__filename}: ${error}` )
        return res.status(500).json(httpResponseUtil.error500(resource, EAction.UPDATE, error))
    }
})

/**
 * @api {get} /users/single/id Get one user 
 */
router.get('/:id', async( req: Request, res: Response ): Promise<any> => {
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