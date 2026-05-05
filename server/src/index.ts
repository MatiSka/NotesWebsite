import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

import "./types/override"
import routesUser from "./routes/RouteUsers"
import routesNotes from "./routes/RouteNotes"
import { Decrypt, Encrypt } from "./auth"

dotenv.config({quiet: true})

mongoose.connect(process.env.mongoDBKey!.toString())

const app = express()

app.use(express.json())
app.use(cors({origin: "*"}))
app.use(routesUser)
app.use(routesNotes)

const p1 = Encrypt("key123", {"a": 1, "b": "c"})
const o1 = Decrypt("key123", p1)

console.log(p1)
console.log(o1)

app.listen(process.env.port , () => {
    console.log(`Server running on ${process.env.port}`)
})