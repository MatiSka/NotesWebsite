import CryptoJS from "crypto-js"
import { NextFunction, type Request, type Response } from "express"
import jwt from "jsonwebtoken"

export function AuthenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader                = req.headers["authorization"]
    const token                     = authHeader && authHeader.split(" ")[1]
    const jwtSecreat: jwt.Secret    = process.env.accessKey!

    if (!token) { return res.sendStatus(401).json({error: true, message: "No token"}) }

    jwt.verify(token, jwtSecreat, (err, user) => {
        if (err) { return res.sendStatus(401).json({error: true, message: "Failed token"}) }

        req.user        = user
        req.accessToken = token
        next()
    })
}

export function Encrypt(key: string, data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString()
}

export function Decrypt(key: string, data: string): any {
    try {
        const bytes = CryptoJS.AES.decrypt(data, key)

        if (bytes.sigBytes <= 0) {return}

        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    } catch (err) {
        throw new Error("Decryption failed")
    }
}