import { nanoid, customAlphabet } from 'nanoid'

export class RandomBuilderUtil {
    constructor() {}
    /**
     * @param length Length of the returned string
     * @param numeric If true, will return a numeric string, otherwise a string with alphanumeric characters
     * @returns ID valid to create friendly URL on Frontend
     */
    public generateId(length: number, numeric: boolean): string {
        return numeric ? 
        customAlphabet('0123456789', length)() :
        nanoid(length).toUpperCase().replace(/_/g, '')
    }

    /**
     * @param length Length of the returned string
     * @param asString If true, will return a string, otherwise a number
     * @returns Random number of specified length
     */
    public generateRandomNumber(length:number, asString: boolean = false): number|string {
        const random = customAlphabet('0123456789', length)()
        return asString ? random : Number(random)
    }

    /**
     * @param length Length of the returned string
     * @returns Random string of specified length
     */
    public generateRandomString(length: number): string {
        return customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', length)()
    }
}
