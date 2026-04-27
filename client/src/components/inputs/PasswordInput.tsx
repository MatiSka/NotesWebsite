import type React from "react"
import { useState } from "react"
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa6"

type props = {
    value:          string,
    onChange:       React.ChangeEventHandler,
    placeholder?:    string
}

export default function PasswordInput({value, onChange, placeholder}: props){
    const [showPassword, SetShowPassword] = useState(false)

    function ToggleShowPassword() {
        SetShowPassword(!showPassword)
    }

    return (
        <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3">
            <input
                value={value}
                onChange={onChange}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder || "password"}
                className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
            />

            {showPassword ? (
                <FaRegEye size={22} className="text-primary cursor-pointer" onClick={() => ToggleShowPassword()}/>
            ) : (
                <FaRegEyeSlash size={22} className="text-slate-400 cursor-pointer" onClick={() => ToggleShowPassword()}/>
            )}
        </div>
    )
}