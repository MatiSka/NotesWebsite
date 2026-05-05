import { Link, useNavigate } from "react-router";
import Navbar from "../Navbar";
import PasswordInput from "../inputs/PasswordInput";
import React, { useState } from "react";
import { ValidateEmail } from "../../scripts/valider";
import axiosInstance from "../../scripts/axiosInstance";
import { type AxiosResponse } from "axios";

export default function Login() {
    const navigate = useNavigate()

    const [email, SetEmail]         = useState<string>("")
    const [password, SetPassword]   = useState<string>("")
    const [errors, SetErrors]       = useState<string[]>([])

    const [focusName, SetFocusName] = useState<boolean>(false)

    async function HandleLogin(event: React.SubmitEvent) {
        event.preventDefault()

        let currentErrors: string[] = []
        
        if(!ValidateEmail(email)){ currentErrors.push("Please enter a valid email address") }
        if (!password){ currentErrors.push("Please enter the password") }

        if (currentErrors.length > 0) {
            SetErrors(currentErrors)
            return
        }

        try {
            const response = await axiosInstance.post("/user-login", {
                "email":      email,
                "password":   password
            }, {withCredentials: true})

            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken)
               navigate("/home")
            }

        } catch (err: AxiosResponse | any) {

            if (err.response && err.response.data && err.response.data.message) {
                SetErrors(err.response.data.message)
            } 
            else {
                SetErrors(["An unexpected error occurred, Please try again later"])
            }
        }
    }

    return (
        <div>
            <Navbar/>

            <div className="flex items-center justify-center mt-28 ml-14 mr-14">
                <div className="w-full sm:w-md border-soft rounded">
                    <h4 className="select-none rounded-t text-3xl text-center py-3 bg-primary text-white">Login</h4>
                    
                    <div className="flex rounded-b">
                        <div className="w-full rounded-b items-center justify-between text-center bg-white px-8 py-8">

                            <form onSubmit={(e) => HandleLogin(e)}>
                                <input
                                    id="Email"
                                    type="text" 
                                    placeholder="Email" 
                                    className={`input-box ${focusName ? "bg-primary/10" : ""}`}
                                    value={email}
                                    onChange={(e) => SetEmail(e.target.value)}
                                    onFocus={() => SetFocusName(!focusName)}
                                    onBlur={() => SetFocusName(!focusName)}
                                />

                                <PasswordInput
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => SetPassword(e.target.value)}
                                />

                                {errors && errors.map((error, index) => (
                                    <p key={index} className="text-red-500 text-sx pb-1">{error}</p>
                                ))}

                                <button type="submit" className="btn-primary mt-1 mb-2">Login</button>

                                <Link to={"/signup"} className="font-medium text-primary text-sm text-center underline mt-2 hover:text-primary/50">
                                    SignUp
                                </Link>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}