import { GetInitials } from "../scripts/valider"
import type { user } from "../types/user"

type props = {
    userInfo: null | user
    OnLogout: () => void
}

export default function ProfileInfo({ userInfo, OnLogout }: props) {
    return (
        <div className="flex items-center gap-3 rounded px-3">
            <div 
                className="w-11 h-11 flex items-center justify-center rounded-full text-slate-950 bg-primary/5"
            >
                {GetInitials(userInfo?.name || "")}
            </div>

            <div>
                <p className="text-sm font-medium">Name</p>

                <button className="text-sm text-primary underline" onClick={OnLogout}>
                    Logout
                </button>
            </div>
        </div>
    )
}