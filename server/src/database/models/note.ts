import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema({
    title:          {type: String, required: true},
    content:        {type: String, required: true},
    tags:           {type: [String], default: []},
    isPinned:       {type: Boolean, default: false},
    CreatedDate:    {type: Date, default: new Date().getTime()},
    
    userId:         {type: String, required: true}
})

export default mongoose.model("Note", noteSchema)