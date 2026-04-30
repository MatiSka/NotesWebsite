import { useState } from "react";
import Navbar from "../Navbar";
import PasswordInput from "../inputs/PasswordInput";
import { Link, useNavigate } from "react-router";
import { ValidateEmail } from "../../scripts/valider";
import axiosInstance from "../../scripts/axiosInstance";
import type { AxiosResponse } from "axios";

export default function SignUp() {
    const navigate = useNavigate()

    const [name, SetName]           = useState("")
    const [email, SetEmail]         = useState("")
    const [password, SetPassword]   = useState("")
    const [error, setError]         = useState("")

    async function HandleSignUp(event: React.SubmitEvent) {
        event.preventDefault()
    
        if (!name) {
            setError("Please enter your name")
            return
        }

        if (!ValidateEmail(email)) {
            setError("Please enter a valid email address")
            return
        }

        if (!password) {
            setError("Please enter the password")
            return
        }

        setError("")

        try {
            const res = await axiosInstance.post("/user-signup", {
                name:       name,
                email:      email,
                password:   password
            })

            if (!res.data) { throw new Error("") }

            if (res.data.error) {
                setError(res.data.message)
            }
            else if (res.data.accessToken) {
                localStorage.setItem("token", res.data.accessToken)
                navigate("/home")
            }

        } catch (err: AxiosResponse | any) {
                
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message)
            }
            else {
                setError("An unexpected error occurred. Please try again leater")
            }
        }
    }

    return (
        <div>
            <Navbar/>
        
            <div className="flex items-center justify-center mt-28 px-1">
                <div className="border-soft rounded">
                    <h4 className="w-100 select-none rounded-t text-3xl text-center py-3 bg-primary text-white">SignUp</h4>

                    <div className="flex rounded-b">
                        <div className="w-100 rounded-b items-end justify-end text-center bg-white px-8 py-8">
        
                            <form onSubmit={(e) => HandleSignUp(e)}>
                                <input
                                    type="text" 
                                        placeholder="Name" 
                                        className="input-box" 
                                        value={name}
                                    onChange={(e) => SetName(e.target.value)}
                                />

                                <input
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

                                {error && <p className="text-red-500 text-sx pb-1">{error}</p>}

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