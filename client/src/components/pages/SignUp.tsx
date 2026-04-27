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
                const res = await axiosInstance.post("/create-account", {
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
                <div className="w-96 border rounded bg-white px-7 py-10">
    
                    <form onSubmit={(e) => HandleSignUp(e)}>
                        <h4 className="text-2xl mb-7">SignUp</h4>

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

                        <button type="submit" className="btn-primary">SignUp</button>

                        <p className="text-sm text-center mt-4">
                            Already have an account? {" "}
                            <Link to={"/login"} className="font-medium text-primary underline">
                                Login
                            </Link>
                        </p>

                    </form>

                </div>
            </div>
        </div>
    )
}