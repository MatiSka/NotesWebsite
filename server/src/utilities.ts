import { NextFunction, type Request, type Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { user } from "./types/user"

export function AuthenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader                = req.headers["authorization"]
    const token                     = authHeader && authHeader.split(" ")[1]
    const jwtSecreat: jwt.Secret    = process.env.accessKey!

    if (!token) { return res.sendStatus(401) }

    jwt.verify(token, jwtSecreat, (err, user) => {
        if (err) { return res.sendStatus(401) }

        req.user = user
        next()
    })
}

export {}