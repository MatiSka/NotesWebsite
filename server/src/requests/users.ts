import {type Request, type Response} from "express"
import userModel from "../database/models/user"
import jwt from "jsonwebtoken"
import { user } from "../types/user"

type reqBody = {
    name?:          string,
    email?:         string,
    password?:      string,
}

type reqUser = {
    user:   user
}



export async function UserSignUp (req: Request, res: Response) {
    const {name, email, password}: reqBody = req.body

    let errors: string[] = []

    if (!name)      { errors.push("Name is required") }
    if (!email)     { errors.push("Email is required") }
    if (!password)  { errors.push("Password is required") }

    if (errors.length > 0) {
        return res.status(400).json({error: true, message: errors})
    }

    const isUser = await userModel.findOne({email: email!})

    if (isUser) {
        return res.status(400).json({error: true, message: "User alredy exist"})
    }

    const user = new userModel({
        name:       name,
        email:      email,
        password:   password
    })

    await user.save()

    const accessToken = jwt.sign({user}, process.env.accessKey!, {expiresIn: "1440m"})
    
    return res.json({
        error:          false,
        message:        "Registration Successful",
        user:           user,
        accessToken:    accessToken
    })
}

export async function UserLogin (req: Request, res: Response) {
    const { email, password }: reqBody = req.body

    let errors: string[] = []

    if (!email)     { errors.push("Email is required") }
    if (!password)  { errors.push("Password is required") }

    if (errors.length > 0) {
        return res.status(400).json({error: true, message: errors})
    }

    const user = await userModel.findOne({email: email!})

    if (!user || user.email != email || user.password != password) {
        return res.status(400).json({error: true, message: "Invalid password or email"})
    }

    const accessToken = jwt.sign({user}, process.env.accessKey!, {expiresIn: "1440m"})

    return res.json({
        error:          false, 
        message:        "login successful",
        email:          email,
        accessToken:    accessToken
    })
}

export async function UserGet (req: Request, res: Response) {
    const { user }: reqUser = req.user

    const isUser: user | undefined | null = await userModel.findOne({_id: user._id})

    if (!isUser) { return res.sendStatus(401) }

    return res.json({
        error:      false,
        message:    "User found",
        user:       {
            "_id":          isUser._id,
            "name":         isUser.name,
            "email":        isUser.email,
            "createdDate":  isUser.createdDate
        },
    })
}