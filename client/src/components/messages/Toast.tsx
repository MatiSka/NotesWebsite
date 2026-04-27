import { LuCheck } from "react-icons/lu"
import type { toastMessage } from "../../types/toastMessage"
import { MdDeleteOutline } from "react-icons/md"
import { useEffect } from "react"

type props = {
    toast:      toastMessage,
    OnClose:    () => void
}

export default function Toast( {toast, OnClose}: props) {

    useEffect(() => {
        const timeOut = setTimeout(OnClose, 3000)

        return () => {
            clearTimeout(timeOut)
        }
    }, [OnClose])

    return (
        <div className={`absolute top-20 left-6 transition-all duration-700 ${toast.visible ? "opacity-100" : "opacity-0"}`}>
            <div 
                className={`min-w-52 bg-white border-slate-200 shadow-2xl rounded-md after:w-1.25 after:h-full 
                    ${toast.type == "delete" ? "after:bg-red-500" : "after:bg-green-500"} 
                    after:absolute after:left-0 after:top-0 after:rounded-l-lg`}
            >
                <div className="flex items-center gap-3 py-2 px-4">
                    <div 
                        className={`w-10 h-10 flex items-center justify-center rounded-full 
                            ${toast.type == "delete" ? "bg-red-50" : "bg-green-50"}`}
                    >
                        {
                            toast.type == "delete" ? (
                                <MdDeleteOutline className="text-xl text-red-500"/>
                            ) : (
                                <LuCheck className="text-xl text-green-500"/>
                            )
                        }
                    </div>

                    <p className="text-sm text-slate-800">{toast.message}</p>

                </div>
            </div>
        </div>
    )
}