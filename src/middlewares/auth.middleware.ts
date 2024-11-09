import { Request, Response, NextFunction } from 'express';
import {  verify } from 'jsonwebtoken';
import { logger } from '../utils/logger.util'
import { EAction, HttpResponseUtil } from '../utils/http-responses.util';

const httpResponseUtil: HttpResponseUtil = new HttpResponseUtil()

export const authMiddleware = ( req: Request, res: Response, next: NextFunction ): any => {
    
    const bearer = Array.isArray( req.headers.bearer ) ? req.headers.bearer[0] : req.headers.bearer;
    if( !bearer ) {
        logger.error( `${__filename}: El token no está presente en los encabezados` );
        return res.status(403).json(httpResponseUtil.error403('Auth', EAction.AUTH, 'El token no está presente o no es válido'))
    }
    if( !process.env.TOKEN_SECRET ) {
        logger.error( `${__filename}: No fue posible obtener el Token - middleware` )
        return res.status(500).json(httpResponseUtil.error500('Auth', EAction.AUTH, 'Ocurrió un error en el flujo de información'))
    }

    try {
        const decoded: any = verify( bearer, process.env.TOKEN_SECRET )
        req.body.token = decoded.data;
        next();
    } catch( error ) {   
        logger.error( `${__filename}: ${error}` );
        return res.status(403).json(httpResponseUtil.error403('Auth', EAction.AUTH, 'Tu sesión no es válida o ha expirado. Ingresa nuevamente'))
    }
};