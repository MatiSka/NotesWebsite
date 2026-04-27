import { NextFunction, type Request, type Response } from "express"
import jwt from "jsonwebtoken"

export function AuthenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader                = req.headers["authorization"]
    const token                     = authHeader && authHeader.split(" ")[1]
    const jwtSecreat: jwt.Secret    = process.env.accessKey!

    if (!token) { return res.sendStatus(401).json({error: true, message: "No token"}) }

    jwt.verify(token, jwtSecreat, (err, user) => {
        if (err) { return res.sendStatus(401).json({error: true, message: "Failed token"}) }

        req.user = user
        next()
    })
}