import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { AuthenticateToken } from "./auth"

import "./types/override"
import { UserGet, UserLogin, UserSignUp } from "./requests/users"
import { NoteAdd, NoteDelete, NoteEdit, NotePinned, NoteSearch, NotesGet } from "./requests/notes"

dotenv.config({quiet: true})

mongoose.connect(process.env.mongoDBKey!.toString())

const app = express()

app.use(express.json())
app.use(cors({origin: "*"}))

// Users //
app.post("/create-account", UserSignUp)
app.post("/login", UserLogin)
app.get("/get-user", AuthenticateToken, UserGet)


// Notes //
app.post("/add-note", AuthenticateToken, NoteAdd)
app.get("/get-all-notes", AuthenticateToken, NotesGet)
app.get("/search-notes", AuthenticateToken, NoteSearch)
app.delete("/delete-note/:noteId", AuthenticateToken, NoteDelete)
app.put("/edit-note/:noteId", AuthenticateToken, NoteEdit)
app.put("/update-note-pinned/:noteId", AuthenticateToken, NotePinned)



app.listen(process.env.port , () => {
    console.log(`Server running on ${process.env.port}`)
})