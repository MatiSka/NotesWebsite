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
        <div className="input-box flex items-center bg-transparent mb-3">
            <input
                value={value}
                onChange={onChange}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder || "Password"}
                className="w-full text-sm bg-transparent mr-3 rounded outline-none"
            />

            {showPassword ? (
                <FaRegEye size={22} className="text-primary cursor-pointer" onClick={() => ToggleShowPassword()}/>
            ) : (
                <FaRegEyeSlash size={22} className="text-slate-400 cursor-pointer" onClick={() => ToggleShowPassword()}/>
            )}
        </div>
    )
}