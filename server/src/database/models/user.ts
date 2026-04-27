import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name:           {type: String},
    email:          {type: String},
    password:       {type: String},
    createdDate:    {type: Date, default: new Date().getTime()}
})

export default mongoose.model("User", userSchema)