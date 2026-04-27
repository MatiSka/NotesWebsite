import { GetInitials } from "../scripts/valider"
import type { user } from "../types/user"

type props = {
    userInfo: null | user
    OnLogout: () => void
}

export default function ProfileInfo({ userInfo, OnLogout }: props) {
    return (
        <div className="flex items-center gap-3">
            <div 
                className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 bg-slate-100"
            >
                {GetInitials(userInfo?.name || "")}
            </div>

            <div>
                <p className="text-sm font-medium">Name</p>

                <button className="text-sm text-slate-700 underline" onClick={OnLogout}>
                    Logout
                </button>
            </div>
        </div>
    )
}