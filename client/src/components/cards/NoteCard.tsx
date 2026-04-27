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
        <div className="border border-slate-200 rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
            <div className="flex items-center justify-between mb-.5">
                <div>
                    <h6 className="text-sm font-medium">{title}</h6>
                    <span className="text-xs text-slate-500">{date}</span>
                </div>

                <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary' : "text-slate-300"}`}  onClick={OnPinNote}/>
            </div>

            <div className="flex gap-2 mb-.5">
                {tags.map((tag, index) => (
                    <p key={index} className="w-auto px-3 text-xs bg-slate-100 text-slate-500 rounded-xs">{tag}</p>
                ))}
            </div>

            <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}</p>

            <div className="flex items-center justify-between mt-2">

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