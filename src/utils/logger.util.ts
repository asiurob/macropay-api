import { Format } from "logform"
import{ LoggerOptions, format, transports, createLogger, Logger } from "winston"

const _format: Format = format.printf( ( { level, message, timestamp } ): string => {
    return `${ timestamp } - ${ level }: ${ message }`
})

const logConf:LoggerOptions = {
    transports: [
        new transports.File({
            filename: 'logger.log'
        })
    ],
    format: format.combine(
        format.label(),
        format.timestamp(),
        _format
    )
}

/**
 * Creates a file where data is written (Example errors)
 */
export const logger: Logger = createLogger( logConf )
