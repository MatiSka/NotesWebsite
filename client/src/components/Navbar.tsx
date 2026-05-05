import { useNavigate } from "react-router";
import ProfileInfo from "./ProfileInfo";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import type { user } from "../types/user";

type props = {
    SearchNotes?:            (query: string) => void,
    HandleClearSearch?:      () => void,
    userInfo?:              null | user
}

export default function Navbar({ SearchNotes, HandleClearSearch, userInfo }: props) {
    const navigate = useNavigate()
    const [searchQuery, SetSearchQuery] = useState("")

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

    if (SearchNotes && HandleClearSearch) {
        useEffect(() => {
            HandleSearch()
        }, [searchQuery])
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