import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

import "./types/override"
import routesUser from "./routes/RouteUsers"
import routesNotes from "./routes/RouteNotes"

dotenv.config({quiet: true})

mongoose.connect(process.env.mongoDBKey!.toString())

const app = express()

app.use(express.json())
app.use(cors({origin: "*"}))
app.use(routesUser)
app.use(routesNotes)

app.listen(process.env.port , () => {
    console.log(`Server running on ${process.env.port}`)
})