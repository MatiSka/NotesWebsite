import type React from "react"
import { FaMagnifyingGlass } from "react-icons/fa6"
import { IoMdClose } from "react-icons/io"

type props = {
    value?:          string,
    OnChange?:       (e: React.ChangeEvent<HTMLInputElement>) => void,
    HandleSearch?:   () => void,
    ClearSearch?:  () => void
}

export default function SearchBar({ value, OnChange, HandleSearch, ClearSearch }: props) {
    return (
        <div className="w-80 flex items-center px-4 bg-slate-100 rounded-md">
            <input
                type="text"
                placeholder="Search Titles"
                className="w-full text-sx bg-transparent py-2.75 outline-none"
                value={value}
                onChange={OnChange}
            />
            {value && 
                <IoMdClose 
                    className="text-xl mr-3 text-slate-400 cursor-pointer hover:text-black" 
                    onClick={ClearSearch} 
                />
            }
           
            <FaMagnifyingGlass 
                className="text-slate-400 cursor-pointer hover:text-black" 
                onClick={HandleSearch} 
            />

        </div>
    )
}