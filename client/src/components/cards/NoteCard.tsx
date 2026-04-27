import { MdCreate, MdDelete, MdOutlinePushPin } from "react-icons/md"

type props = {
    key:        string,
    title:      string,
    date:       string,
    content:    string,
    tags:       string[],
    isPinned:   boolean,

    OnEdit:     () => void,
    OnDelete:   () => void,
    OnPinNote:  () => void
}

export default function NoteCard({title, date, content, tags, isPinned, OnEdit, OnDelete, OnPinNote}: props) {
    return (
        <div className={`border ${isPinned ? "border-primary" : "border-gray-300"} rounded p-4 bg-white hover:shadow-xl hover:border-2 hover:bg-primary/1 transition-all ease-in-out`}>
            <div className="h-[85%]">
                <div className="flex items-center justify-between mb-.5">
                    <div>
                        <h6 className="text-sm font-medium">{title}</h6>
                        <span className="text-xs text-slate-500">{date}</span>
                    </div>

                    <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary hover:text-slate-300/50' : "text-slate-300 hover:text-primary/50"}`}  onClick={OnPinNote}/>
                </div>

                <div className="flex flex-wrap gap-2 mb-.5">
                    {tags.map((tag, index) => (
                        <p key={index} className="w-auto text-center px-3 py-.5 text-xs bg-primary/20 text-slate-600 rounded">{tag}</p>
                    ))}
                </div>

                <p className="text-xs text-slate-600 mt-2 wrap-break-word">{content?.slice(0, 55)} {content?.length > 55 ? "..." : ""}</p>
            </div>
            
            <div className="h-[15%] flex items-center justify-between mt-2">

                <div className="flex items-center gap-2">
                    <MdCreate
                        className="icon-btn hover:text-blue-500"
                        onClick={OnEdit}
                    />

                    <MdDelete
                        className="icon-btn hover:text-red-500"
                        onClick={OnDelete}
                    />
                </div>
            </div>
        </div>
    )
}