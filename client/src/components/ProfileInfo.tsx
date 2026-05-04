import { GetInitials } from "../scripts/valider"
import type { user } from "../types/user"

type props = {
    userInfo: null | user
    OnLogout: () => void
}

export default function ProfileInfo({ userInfo, OnLogout }: props) {
    let userName: string = userInfo?.name || ""

    return (
        <div className="flex items-center gap-3 rounded">
            <p className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 bg-primary/5">
                {GetInitials(userName)}
            </p>

            <div>
                <p className="text-md">{userName}</p>

                <button className="text-sm text-primary underline" onClick={OnLogout}>
                    Logout
                </button>
            </div>
        </div>
    )
}