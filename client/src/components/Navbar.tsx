import { useNavigate } from "react-router";
import ProfileInfo from "./ProfileInfo";
import SearchBar from "./SearchBar";
import { useState } from "react";
import type { user } from "../types/user";

type props = {
    SearchNotes?:            (query: string) => void,
    HandleClearSearch?:      () => void,
    userInfo?:              null | user
}

export default function Navbar({ SearchNotes, HandleClearSearch, userInfo }: props) {
    const [searchQuery, SetSearchQuery] = useState("")
    const navigate                      = useNavigate()

    function OnLogout() {
        localStorage.clear()
        navigate("/login")
    }

    function HandleSearch() {
        if (searchQuery) {
            SearchNotes!(searchQuery)
        } else {
            ClearSearch()
        }
    }

    function ClearSearch() {
        SetSearchQuery("")
        HandleClearSearch!()
    }

    return (
        <nav className="bg-white flex items-center justify-between gap-3 px-4 py-2 drop-shadow border border-slate-200">
            <h2 className="text-md font-medium text-primary">Notes</h2>

            {userInfo && 
                <SearchBar 
                    value={searchQuery}
                    OnChange={(e) => {SetSearchQuery(e.target.value)}}
                    HandleSearch={HandleSearch}
                    ClearSearch={ClearSearch}
                />
            }

            {userInfo && <ProfileInfo userInfo={userInfo} OnLogout={OnLogout} />}
        </nav>
    )
}