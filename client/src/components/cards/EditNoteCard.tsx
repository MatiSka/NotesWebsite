import { useState } from "react";
import TagInput from "../inputs/TagInput";
import type { note } from "../../types/note";
import axiosInstance from "../../scripts/axiosInstance";
import { type AxiosResponse } from "axios";
import type { toastMessage } from "../../types/toastMessage";

type props = {
    OnClose:        () => void,
    GetAllNotes:    () => void,
    EditToast:      (message: string, type: string) => void,
    note:           note | null,
    type:           string
}

export default function EditNoteCard({ OnClose, GetAllNotes, EditToast, note, type }: props) {
    const [title, SetTitle]     = useState<string>(note?.title || "")
    const [content, SetContent] = useState<string>(note?.content || "")
    const [tags, SetTags]       = useState<string[]>(note?.tags || [])

    const [errors, SetErrors]   = useState<string[]>([])

    async function AddNote() {
        try {
            const res = await axiosInstance.post("/add-note", {
                "title":    title,
                "content":  content,
                "tags":     tags
            })

            if (!res.data) {throw new Error("")}

            if (res.data.note) {
                EditToast("Note added successfully", "add")
                GetAllNotes()
                OnClose()
            }
        } catch (err: AxiosResponse | any) {
            if (err.response && err.response.data && err.response.data.message) {
                SetErrors([err.response.data.message])

            } else {
                SetErrors(["Unexpected error occured"])
            }
        }
    }

    async function EditNote() {
        const noteId = note?._id

        try {
            const res = await axiosInstance.put("/edit-note/" + noteId, {
                "title":    title,
                "content":  content,
                "tags":     tags
            })

            if (!res.data) { throw new Error("")}

            if (res.data.note) {
                EditToast("Note updated successfully", "add")
                GetAllNotes()
                OnClose()
            }
        } catch (err: AxiosResponse | any) {
            if (err.response && err.response.data && err.response.data.message) {
                SetErrors([err.response.data.message])

            } else {
                SetErrors(["Unexpected error occured"])
            }
        }
    }

    function HandleNoteChange() {
        let errorsToSet = []

        if (!title) {
            errorsToSet.push("Please enter the title")
        }

        if (!content) {
            errorsToSet.push("Please enter the content")
        }

        if (errorsToSet.length == 0) { 
            SetErrors([]) 
        }
        else {
            SetErrors(errorsToSet)
        }

        if (type == "edit"){
            EditNote()
        } 
        else {
            AddNote()
        }
    }

    return (
        <div className="relative">

            <div className="flex flex-col gap-2">
                <label className="input-label">Title</label>
                
                <input
                    type="text"
                    className="text-xl text-slate-950 outline-none bg-slate-100 p-2 rounded-md"
                    placeholder=""
                    onChange={(e) => {SetTitle(e.target.value)}}
                    value={title}
                />

            </div>

            <div className="flex flex-col gap-2 mt-3">
                <label className="input-label">Content</label>
                <textarea
                    typeof="text"
                    className="text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded-md max-h-50 resize-none"
                    placeholder=""
                    onChange={(e) => {SetContent(e.target.value)}}
                    value={content}
                    rows={10}
                    maxLength={1024}
                    
                />
            </div>

            <div className="mt-3">
                <label className="input-label">Tags</label>
                <TagInput tags={tags} SetTags={SetTags}/>
            </div>

            <div className="m-1">
                {errors.length > 0 &&
                    errors.map((error, index) => (
                        <p key={index} className="text-red-600 text-sx mt-1 pt-1">* {error}</p>
                    ))
                }
            </div>

            <div className="flex gap-3">
                <button 
                    className="btn-primary mt-5 p-3"
                    onClick={HandleNoteChange}
                > {type == "add" ? "Add" : "Update"} </button>

                <button
                    className="btn-close mt-5 p-3 w-1/5"
                    onClick={OnClose}
                > Close </button>
            </div>

        </div>
    )
}