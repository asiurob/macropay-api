import { Router, Request, Response } from 'express'
import { EAction, HttpResponseUtil } from '../utils/http-responses.util'
import { logger } from '../utils/logger.util'
import { User } from '../models/users/user.model'

const router: Router = Router()
const httpResponseUtil: HttpResponseUtil = new HttpResponseUtil()
const resource = 'usuario'

/**
 * @api {post} /users/ Create a new user
 */
router.post('/', async( req: Request, res: Response ): Promise<any> => {
    const { email, name, last_name, pass } = req.body

    try {
        const user = (await User.create({ email, name, last_name, pass })).toJSON();
        delete user.pass;
        return res.status(201).json(
            httpResponseUtil.create(resource, user, EAction.CREATE)
        )
    } catch (error: any) {
        logger.error( `${__filename}: ${error}` )
        return res.status(500).json(httpResponseUtil.error500(resource, EAction.CREATE, error))
    } finally {
        
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
        const result = await User.findByPk( id );
        const message = result ? EAction.READ : `No se encontró información del usuario ${ id }`;
        return res.status(200).json(
            httpResponseUtil.success(resource, EAction.READ, message, {...result?.dataValues})
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
    const id = req.params.id
    try {
        const result = await User.destroy({ where: { id } });
        const message = result ? 'Se eliminó correctamente al usuario' : `No se fue posible eliminar al usuario ${ id }`;
        return res.status(200).json(
            httpResponseUtil.success(resource, EAction.DELETE, message)
        )
    } catch( error: any ) {
        logger.error( `${__filename}: ${error}` )
        return res.status(500).json(httpResponseUtil.error500(resource, EAction.DELETE, error))
    }
})

export default router