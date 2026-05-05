import express, {type Request, type Response} from "express"
import noteModel from "../db/models/ModelNote"
import { user } from "../types/TypeUser"
import { AuthenticateToken, Encrypt } from "../auth"

type reqBody = {
    title?:         string,
    content?:       string,
    tags?:          string[],
    isPinned?:      boolean
}

type reqUser = {
    user:   user
}

export async function NoteAdd (req: Request, res: Response) {
    const { title, content, tags }: reqBody = req.body
    const { user }: reqUser = req.user

    let errors: string[] = []

    if (!title)     { errors.push("Title is required") }
    if (!content)   { errors.push("Content is required") }
    if (!user)      { errors.push("Invalid user data") }

    if (errors.length > 0) {
        return res.status(400).json({error: true, message: errors})
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
}

export async function NoteDelete (req: Request, res: Response) {
    const noteId = req.params.noteId
    const {user}: reqUser = req.user

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
}

export async function NoteEdit (req: Request, res: Response) {
    const noteId = req.params.noteId
    const { title, content, tags, isPinned }: reqBody = req.body
    const { user }: reqUser = req.user

    let errors: string[] = []

    if (!user) { 
        errors.push("Invalid user data") 
    }
    if (!title && !content && !tags) { 
        errors.push("No changes provided") 
    }

    if (errors.length > 0) {
        return res.status(400).json({error: true, message: errors})
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
}

export async function NotesGet (req: Request, res: Response) {
    const { user }: reqUser = req.user

    if (!user) {
        return res.status(400).json({error: true, message: "Invalid user data"})
    }

    try {
        const notes = await noteModel.find({userId: user._id}).sort({isPinned: -1})

        return res.json({
            error:      false,
            message:    "All notes recived",
            notes:      Encrypt(req.accessToken, notes)
        })
    } catch (err) {
        return res.status(500).json({
            error:      true,
            message:    "Internal server error"
        })
    }
}

export async function NotePinned (req: Request, res: Response) {
    const noteId = req.params.noteId
    const { isPinned }: reqBody = req.body
    const { user }: reqUser = req.user

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
}

export async function NoteSearch (req: Request, res: Response) {
    const { user }: reqUser  = req.user
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
}

const routesNotes = express.Router()

routesNotes.post("/add-note"                    , AuthenticateToken, NoteAdd)
routesNotes.get("/get-all-notes"                , AuthenticateToken, NotesGet)
routesNotes.get("/search-notes"                 , AuthenticateToken, NoteSearch)
routesNotes.delete("/delete-note/:noteId"       , AuthenticateToken, NoteDelete)
routesNotes.put("/edit-note/:noteId"            , AuthenticateToken, NoteEdit)
routesNotes.put("/update-note-pinned/:noteId"   , AuthenticateToken, NotePinned)

export default routesNotes
