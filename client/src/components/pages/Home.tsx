import { MdAdd } from "react-icons/md";
import Navbar from "../Navbar";
import NoteCard from "../cards/NoteCard";
import EditNoteCard from "../cards/EditNoteCard";
import { useEffect, useState } from "react";
import ReactModal from "react-modal"
import { useNavigate } from "react-router";
import axiosInstance from "../../scripts/axiosInstance";
import type { AxiosResponse } from "axios";
import type { user } from "../../types/user";
import type { note, openEditNote } from "../../types/note";
import { GetCurrentTime } from "../../scripts/valider";
import type { toastMessage } from "../../types/toastMessage";
import Toast from "../messages/toast";
import EmptyCard from "../cards/EmptyCard";

export default function Home() {
    const navigate = useNavigate()

    const [openEditNoteModal, SetOpenEditNoteModal] = useState<openEditNote>({
        isShow:     false,
        type:       "add",
        data:       null
    })

    const [showToastMessage, SetShowToastMessage] = useState<toastMessage>({
        "visible":      true,
        "type":         "add",
        "message":      "Note added successfully"
    })

    const [userInfo, SetUserInfo] = useState<user | null>(null)
    const [allNotes, SetAllNotes] = useState<note[] | null>(null)
    const [isSearch, SetIsSearch] = useState(false)

    function CloseToast() {
        SetShowToastMessage({
            visible:    false,
            type:       showToastMessage.type,
            message:    ""
        })
    }

    function EditToast(message: string, type: string) {
        SetShowToastMessage({
            visible:    true,
            type:       type,
            message:    message
        })
    }

    function HandleClearSearch() {
        SetIsSearch(false)
        GetAllNotes()
    }

    async function UpdateIsPinned(note: note) {
        const noteId = note?._id

        try {
            const res = await axiosInstance.put("/update-note-pinned/" + noteId, {
                "isPinned": !note?.isPinned
            })

            if (!res.data) { throw new Error("")}

            if (res.data.note) {
                EditToast(`Note ${!note.isPinned ? "pinned" : "unpinned"}`, "add")
                GetAllNotes()
            }
        } catch (err: AxiosResponse | any) {
            console.log(err)
        }
    }

    async function HandleEdit(note: note) {
        SetOpenEditNoteModal({isShow: true, data: note, type: "edit"})
    }

    async function NoteDelete(note: note) {
        try {
            const res = await axiosInstance.delete("/delete-note/" + note._id)

            if (!res.data) { throw new Error("")}

            if (!res.data.error) {
                EditToast("Note deleted successfully", "delete")
                GetAllNotes()
            }
        } catch (err: AxiosResponse | any) {
            if (err.response && err.response.data && err.response.data.message) {
                console.log(err.response.data.message)

            } else {
                console.log("Unexpected error occured")
            }
        }
    }

    async function SearchNotes(query: string) {
        try {
            const res = await axiosInstance.get("/search-notes", {
                params: { query }
            })

            if (!res.data) {throw new Error("")}

            if (res.data.notes) {
                SetIsSearch(true)
                SetAllNotes(res.data.notes)
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function GetUserInfo() {
        try {
            const res = await axiosInstance.get("get-user")

            if (res.data && res.data.user) {
                SetUserInfo(res.data.user)
            }
        } catch (err: AxiosResponse | any) {
            if (err.response.status == 401) {
                localStorage.clear()
                navigate("/login")
            }
        }
    }

    async function GetAllNotes() {
        try {
            const res = await axiosInstance.get("/get-all-notes")

            if (!res.data) { throw new Error("") }

            if (res.data.notes) {
                SetAllNotes(res.data.notes)
            }

        } catch (err) {
            console.log("An unexpected error occured while loading notes. Please try again later")
        }
    }


    useEffect(() => {
       GetUserInfo()
       GetAllNotes()
    }, [])

    return (
        <div>
            <Navbar userInfo={userInfo} SearchNotes={SearchNotes} HandleClearSearch={HandleClearSearch}/>
            
            {allNotes && allNotes?.length > 0 ? (
                <div className="container mx-auto">
                    <div className=" grid grid-cols-3 gap-4 mt-8">

                        {allNotes?.map((note: note) => (
                            <NoteCard
                                key={note._id}
                                title={note.title}
                                date={GetCurrentTime(note.CreatedDate)}
                                content={note.content}
                                tags={note.tags || []}
                                isPinned={note.isPinned}
                                OnEdit={() => HandleEdit(note)}
                                OnDelete={() => NoteDelete(note)}
                                OnPinNote={() => UpdateIsPinned(note)}
                            />
                        ))}

                    </div>
                </div>
            ) : (
                <EmptyCard message={ isSearch ? (
                        `No matching search results`
                    ) : (
                        `Click the "+" button to create your first note!`
                    )
                }/>
            )}

            <button 
                className="absolute w-16 h-16 flex items-center justify-center right-10 bottom-10 rounded-2xl  hover:shadow-xl transition-all" 
                onClick={() => {
                    SetOpenEditNoteModal({ isShow: true, type: "add", data: null })
                }}
            >
                <MdAdd 
                    className="btn-primary w-full h-full text-[32px]rounded-2xl rounded-xl"
                />
            </button>

            <ReactModal
                isOpen={openEditNoteModal.isShow}
                onRequestClose={() => {}}
                ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,.2)"
                    }
                }}
                contentLabel=""
                className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-y-auto"
            >
                <EditNoteCard 
                    OnClose={() => {SetOpenEditNoteModal({isShow: false, type: "", data: null})}}
                    GetAllNotes={GetAllNotes}
                    EditToast={EditToast}
                    type={openEditNoteModal.type}
                    note={openEditNoteModal.data}
                />
            </ReactModal>

            <Toast 
                toast={showToastMessage}
                OnClose={CloseToast}
            />
        </div>
    )
}