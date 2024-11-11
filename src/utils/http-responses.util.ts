
export class HttpResponseUtil {

    /**
     * 
     * @param resource Is the resource that is being created, updated or deleted
     * @param action Is the action that is being performed
     * @param message This message is appended to the response 
     * @returns Returns a response with a status of 200 and a message 
     */
    public success( resource: string, action: EAction | string, message = '', payload?: any): IHttpResponse {
        return {
            status: 200,
            title: 'Operación exitosa',
            message,
            map: `${action} ${resource}`,
            payload,
        }
    }

    /**
     * 
     * @param resource Is the resource that is being created, updated or deleted
     * @param action Is the action that is being performed
     * @param message This message is appended to the response 
     * @returns Returns a response with a status of 201 and a message 
     */
        public create( resource: string, payload: any, action: EAction, message = ''): IHttpResponse {
        return {
            status: 201,
            title: 'La operación se realizó correctamente',
            message,
            map: `${action} ${resource}.`,
            payload
        }
        }

    

    /**
     * @param resource Is the resource that is being created, updated or deleted
     * @param action Is the action that is being performed
     * @param error Is the error that is being thrown
     * @param aditionalInfo This message is appended to the response
     * @returns Returns a response with a status of 500 and a message
     */
    public error500(resource: string, action: EAction, error?: any, aditionalInfo = ''): IHttpResponse {
        const errorSelector = error?.errors?.map( (err: any) => err?.message );
        const message = `No se pudo completar la petición: ${aditionalInfo}`.trim()
        return {
            status: 500,
            title: 'Ocurrió un error interno',
            message,
            errorSelector,
            map: `${action} ${resource}`
        }
    }
    
    /**
     * 
     * @param resource Is the resource that is being created, updated or deleted
     * @param action Is the action that is being performed
     * @param message This message is appended to the response
     * @returns  Returns a response with a status of 400 and a message
     */
    public error404(resource: string, action: EAction, message = ''): IHttpResponse {
        return {
            status: 404,
            title: 'El recurso no existe',
            message: `No se pudo completar la petición: ${message}`,
            map: `${action} ${resource}`
        }
    }

    /**
     * 
     * @param resource Is the resource that is being created, updated or deleted
     * @param action Is the action that is being performed
     * @param message This message is appended to the response
     * @returns  Returns a response with a status of 400 and a message
     */
    public error400(resource: string, action: EAction, message = ''): IHttpResponse {
        return {
            status: 400,
            title: 'La información proporcionada no es válida',
            message: `No se pudo completar la petición: ${message}`,
            map: ` ${action} ${resource}`
        }
    }

        /**
     * 
     * @param resource Is the resource that is being created, updated or deleted
     * @param action Is the action that is being performed
     * @param message This message is appended to the response
     * @returns  Returns a response with a status of 403 and a message
     */
        public error403(resource: string, action: EAction, message = ''): IHttpResponse {
            return {
                status: 403,
                title: 'No tienes permiso para acceder a esta acción',
                message: `No se pudo completar la petición: ${message}`,
                map: `${action} ${resource}`
            }
        }

            /**
     * 
     * @param resource Is the resource that is being created, updated or deleted
     * @param action Is the action that is being performed
     * @param message This message is appended to the response
     * @returns  Returns a response with a status of 403 and a message
     */
        public error401(resource: string, action: EAction, message = ''): IHttpResponse {
            return {
                status: 401,
                title: 'La petición fue denegada por credenciales incorrectas',
                message: `No se pudo completar la petición: ${message}`,
                map: `${action} ${resource}`
            }
        }
}

export enum EAction {
    CREATE = 'Creación',
    READ = 'Lectura',
    UPDATE = 'Actualización',
    DELETE = 'Borrado',
    AUTH   = 'Autenticación'
}

interface IHttpResponse {
    status: number
    title: string
    message: string
    map: string,
    errorSelector?: string[]
    payload?: any
}
