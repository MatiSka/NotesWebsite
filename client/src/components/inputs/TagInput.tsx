import React, { useState } from "react"
import { MdAdd, MdClose } from "react-icons/md"

type props = {
    tags:       string[],
    SetTags:    React.Dispatch<React.SetStateAction<string[]>>
}

export default function TagInput( { tags, SetTags }: props) {
    const [inputValue, SetInputValue] = useState("")

    function HandleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        SetInputValue(e.target.value)
    }

    function AddNewTag() {
        const value = inputValue.trim().toLowerCase()

        if (value == ""){return}

        SetTags([...tags, value])
        SetInputValue("")
    }

    function RemoveTag(tagToRemove: string) {
        SetTags(
            tags?.filter((tag) => tag != tagToRemove)
        )
    }
    
    function HandleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == "Enter"){
            AddNewTag()
        }
    }

    return (
        <div>
            {tags?.length > 0 &&
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {tags.map((tag, index) => (
                        <div 
                            key={index} 
                            className="flex w-auto items-center gap-3 px-2 mt-2 bg-slate-100 text-slate-500 rounded-xs
                            hover:bg-slate-200 transition-all"
                        >
                            {tag}
                            <button onClick={() => {RemoveTag(tag)}}>
                                <MdClose className="text-slate-400 hover:text-red-600"/>
                            </button>
                        </div>
                    ))}
                </div>
            }
            
            <div className="flex items-center gap-4 mt-3">
                <input 
                    type="text" 
                    value={inputValue}
                    className="text-sm bg-transparency px-3 py-2 rounded-md outline-none border border-slate-300" 
                    placeholder=""
                    onChange={HandleInputChange}
                    onKeyDown={HandleKeyDown}
                />

                <button 
                    className="w-8 h-8 flex items-center justify-center"
                    onClick={AddNewTag}
                >
                    <MdAdd 
                        className="w-full h-full text-2xl text-primary hover:text-white hover:bg-primary rounded-md
                        transition-all hover:shadow-xl"
                    />
                </button>
            </div>
        </div>
    )
}