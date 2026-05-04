import { useState } from "react";
import Navbar from "../Navbar";
import PasswordInput from "../inputs/PasswordInput";
import { Link, useNavigate } from "react-router";
import { ValidateEmail } from "../../scripts/valider";
import axiosInstance from "../../scripts/axiosInstance";
import type { AxiosResponse } from "axios";

export default function SignUp() {
    const navigate = useNavigate()

    const [name, SetName]           = useState<string>("")
    const [email, SetEmail]         = useState<string>("")
    const [password, SetPassword]   = useState<string>("")
    const [errors, SetErrors]       = useState<string[]>([])

    async function HandleSignUp(event: React.SubmitEvent) {
        event.preventDefault()
    
        let currentErrors: string[] = []

        if (!name) { currentErrors.push("Please enter your name") }
        if (!ValidateEmail(email)) { currentErrors.push("Please enter a valid email address") }
        if (!password) { currentErrors.push("Please enter the password") }

        if (currentErrors.length > 0 ) {
            SetErrors(currentErrors)
            return
        }

        try {
            const res = await axiosInstance.post("/user-signup", {
                name:       name,
                email:      email,
                password:   password
            })

            if (!res.data) { throw new Error("") }

            if (res.data.error) {
                SetErrors(res.data.message)
            }
            else if (res.data.accessToken) {
                localStorage.setItem("token", res.data.accessToken)
                navigate("/home")
            }

        } catch (err: AxiosResponse | any) {
                
            if (err.response && err.response.data && err.response.data.message) {
                SetErrors(err.response.data.message)
            }
            else {
                SetErrors(["An unexpected error occurred. Please try again leater"])
            }
        }
    }

    return (
        <div>
            <Navbar/>

            <div className="flex items-center justify-center mt-28 ml-14 mr-14">
                <div className="w-full sm:w-md border-soft rounded">
                    <h4 className="select-none rounded-t text-3xl text-center py-3 bg-primary text-white">SignUp</h4>
                                
                    <div className="flex rounded-b">
                        <div className="w-full rounded-b items-center justify-between text-center bg-white px-8 py-8">
            
                            <form onSubmit={(e) => HandleSignUp(e)}>
                                <input
                                    id="name"
                                    type="text" 
                                    placeholder="Name" 
                                    className="input-box" 
                                    value={name}
                                    onChange={(e) => SetName(e.target.value)}
                                />

                                <input
                                    id="email"
                                    type="text" 
                                    placeholder="Email" 
                                    className="input-box" 
                                    value={email}
                                    onChange={(e) => SetEmail(e.target.value)}
                                />
            
                                <PasswordInput
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => SetPassword(e.target.value)}
                                />
            
                                {errors && errors.map((error, index) => (
                                    <p key={index} className="text-red-500 text-sx pb-1">{error}</p>
                                ))}
            
                                <button type="submit" className="btn-primary mt-1 mb-2">SignUp</button>
            
                                <Link to={"/login"} className="font-medium text-primary text-sm text-center underline mt-2 hover:text-primary/50">
                                    Login
                                </Link>
                            </form>
            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}