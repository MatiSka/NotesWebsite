import express, {type Request, type Response} from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { AuthenticateToken } from "./utilities"

import userModel from "./database/models/user"
import noteModel from "./database/models/note"

import "./types/override"
import { user } from "./types/user"
import { error } from "node:console"
import note from "./database/models/note"

dotenv.config({quiet: true})

mongoose.connect(process.env.mongoDBKey!.toString())

const app = express()

app.use(express.json())
app.use(cors({origin: "*"}))


app.post("/create-account", async (req: Request, res: Response) => {
    const {name, email, password}: {name: string, email: string, password: string} = req.body

    if (!name) {
        return res.status(400).json({error: true, message: "Name is required"})
    }

    if (!email) {
        return res.status(400).json({error: true, message: "Email is required"})
    }

    if (!password) {
        return res.status(400).json({error: true, message: "Password is required"})
    }

    const isUser = await userModel.findOne({email: email.toString()})

    if (isUser) {
        return res.status(400).json({error: true, message: "User alredy exist"})
    }

    const user = new userModel({
        name:       name,
        email:      email,
        password:   password
    })

    await user.save()

    const accessToken = jwt.sign({user}, process.env.accessKey!, {expiresIn: "30m"})
    
    return res.json({
        error:          false,
        message:        "Registration Successful",
        user:           user,
        accessToken:    accessToken
    })
})

app.post("/login", async (req: Request, res: Response) => {
    const { email, password }: {email: string, password: string} = req.body

    if (!email) {
        return res.status(400).json({error: true, message: "email is required"})
    }

    if (!password) {
        return res.status(400).json({error: true, message: "password is required"})
    }

    const user = await userModel.findOne({email: email.toString()})

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
})

app.get("/get-user", AuthenticateToken, async (req: Request, res: Response) => {
    const { user }: {user: user} = req.user

    const isUser: user | undefined | null = await userModel.findOne({_id: user._id})

    if (!isUser) {
        return res.sendStatus(401)
    }

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
})



app.post("/add-note", AuthenticateToken, async (req: Request, res: Response) => {
    const { title, content, tags }: {title: string, content: string, tags: string[]} = req.body
    const { user }: {user: user} = req.user

    if (!title) {
        return res.status(400).json({error: true, message: "Title is required"})
    }

    if (!content) {
        return res.status(400).json({error: true, message: "Content is required"})
    }

    if (!user) {
        return res.status(400).json({error: true, message: "Invalid user data"})
    }

    try {
        const note = new noteModel({
            title:      title,
            content:    content,
            tags:       tags || [],
            
            userId:     user._id
        })

        await note.save()

        return res.json({
            error:      false,
            message:    "Note added successfuly",
            note:       note
        })
    } catch (err) {
        return res.status(500).json({
            error:      true,
            message:    "Internal server error"
        })
    }
})

app.put("/edit-note/:noteId", AuthenticateToken, async (req: Request, res: Response) => {
    const noteId = req.params.noteId
    const { title, content, tags, isPinned }: {title: string, content: string, tags: string[], isPinned: boolean} = req.body
    const { user }: {user: user} = req.user

    if (!noteId || Array.isArray(noteId)) {
        return res.status(400).json({error: true, message: "Wrong data"})
    }

    if (!user) {
        return res.status(400).json({error: true, message: "Invalid user data"})
    }

    if (!title && !content && !tags) {
        return res.status(400).json({error: true, message: "No changes provided"})
    }

    try {
        const note = await noteModel.findOne({_id: noteId, userId: user._id})

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found"})
        }

        if (title)      { note.title = title }
        if (content)    { note.content = content }
        if (tags)       { note.tags = tags }
        if (isPinned)   { note.isPinned = isPinned}

        await note.save()

        return res.json({
            error:      false,
            message:    "Note updated successfully",
            note:       note
        })
    } catch (err) {
        return res.status(500).json({
            error:      true,
            message:    "Internal server error"
        })
    }
})

app.get("/get-all-notes", AuthenticateToken, async (req: Request, res: Response) => {
    const { user }: {user: user} = req.user

    if (!user) {
        return res.status(400).json({error: true, message: "Invalid user data"})
    }

    try {
        const notes = await noteModel.find({userId: user._id}).sort({isPinned: -1})

        return res.json({
            error:      false,
            message:    "All notes recived",
            notes:      notes
        })
    } catch (err) {
        return res.status(500).json({
            error:      true,
            message:    "Internal server error"
        })
    }
})

app.delete("/delete-note/:noteId", AuthenticateToken, async (req: Request, res: Response) => {
    const noteId = req.params.noteId
    const {user}: {user: user} = req.user

    if (!noteId || !user || (typeof noteId != "string")) {
        return res.status(400).json({error: true, message: "Wrong data"})
    }

    try {
        const note = await noteModel.findOne({_id: noteId, userId: user._id})

        if (!note) {
            return res.status(404).json({error: true, message: "Note not found"})
        }

        await note.deleteOne({_id: noteId, userId: user._id})

        return res.json({
            error:      false,
            message:    "Note deleted successfully"
        })
    } catch (err) {
        return res.status(500).json({
            error:      true,
            message:    "Internal server error"
        })
    }
})

app.put("/update-note-pinned/:noteId", AuthenticateToken, async (req: Request, res: Response) => {
    const noteId = req.params.noteId
    const { isPinned }: {isPinned: boolean} = req.body
    const { user }: {user: user} = req.user

    if (!noteId || !user || typeof isPinned != "boolean") {
        return res.status(400).json({error: true, message: "Empty data"})
    }

    try {
        const note = await noteModel.findOne({_id: noteId, userId: user._id})

        if (!note) {
            return res.status(404).json({error: true, message: "Note not found"})
        }

        note.isPinned = isPinned

        await note.save()

        return res.json({
            error:      false,
            message:    "Note updated successfully",
            note:       note
        })
    } catch (err) {
        return res.status(500).json({
            error:      true,
            message:    "Internal server error"
        })
    }
})

app.get("/search-notes", AuthenticateToken, async (req: Request, res: Response) => {
    const { user }: {user: user}  = req.user
    const { query } = req.query

    if (!query || typeof(query) != "string") {
        return res.status(400).json({error: true, message: "Search query is required"})
    }

    try {
        const machingNotes = await noteModel.find({
            userId: user._id,

            $or: [
                {title: {$regex: new RegExp(query, "i")}},
                {content: {$regex: new RegExp(query, "i")}},
            ],
        })

        return res.json({
            error:      false,
            message:    "Notes matching the search query retrieved succeessfully",
            notes:      machingNotes
        })

    } catch (err) {
        return res.status(500).json({error: true, message: "Internal server error"})
    }
})

app.listen(process.env.port , () => {
    console.log(`Server running on ${process.env.port}`)
})