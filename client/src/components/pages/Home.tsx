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
import Toast from "../messages/Toast";
import EmptyCard from "../cards/EmptyCard";
import { Decrypt } from "../../scripts/auth";

export default function Home() {
    const navigate = useNavigate()

    const [modalEditNote, SetModalEditNote] = useState<openEditNote>({
        isShow:     false,
        type:       "add",
        data:       null
    })

    const [toastMessage, SetToastMessage] = useState<toastMessage>({
        visible:      false,
        type:         "add",
        message:      ""
    })

    const [userInfo, SetUserInfo]   = useState<user | null>(null)
    const [notes, SetNotes]         = useState<note[] | null>(null)
    const [isSearch, SetIsSearch]   = useState<boolean>(false)

    function ToastClose() {
        SetToastMessage({
            visible:    false,
            type:       toastMessage.type,
            message:    ""
        })
    }

    function ToastEdit(message: string, type: string, isVisible?: boolean) {
        SetToastMessage({
            visible:    isVisible || true,
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
                ToastEdit(`Note ${!note.isPinned ? "pinned" : "unpinned"}`, "add")
                GetAllNotes()
            }
        } catch (err: AxiosResponse | any) {
            console.log(err)
        }
    }

    async function HandleModal(note: note) {
        SetModalEditNote({isShow: true, data: note, type: "edit"})
    }

    async function NoteDelete(note: note) {
        try {
            const res = await axiosInstance.delete("/delete-note/" + note._id)

            if (!res.data) { throw new Error("")}

            if (!res.data.error) {
                ToastEdit("Note deleted successfully", "delete")
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
                SetNotes(res.data.notes)
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function GetUserInfo() {
        try {
            const res = await axiosInstance.get("user-get")

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
        let token = localStorage.getItem("token")

        try {
            const res = await axiosInstance.get("/get-all-notes")

            if (!res.data || !token) { throw new Error("") }

            if (res.data.notes) {
                SetNotes(Decrypt(token, res.data.notes))
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
            
            {notes && notes?.length > 0 ? (
                <div className="mx-auto">
                    <div className="ml-4 mr-4 sm:ml-8 sm:mr-8 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 mt-4">

                        {notes?.map((note: note) => (
                            <NoteCard
                                key={note._id}
                                title={note.title}
                                date={GetCurrentTime(note.createdDate)}
                                content={note.content}
                                tags={note.tags || []}
                                isPinned={note.isPinned}
                                OnEdit={() => HandleModal(note)}
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
                onClick={() => SetModalEditNote({ isShow: true, type: "add", data: null })}
            >
                <MdAdd className="btn-primary w-full h-full text-[32px]rounded-2xl rounded-xl" />
            </button>

            <ReactModal
                isOpen={modalEditNote.isShow}
                onRequestClose={() => {}}
                ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,.2)"
                    }
                }}
                contentLabel=""
                className="w-5/6 sm:w-1/2 max-h-5/6 bg-white border-2 border-gray-300 rounded-md mx-auto mt-14 p-5 shadow-xl overflow-y-auto"
            >
                <EditNoteCard 
                    OnClose={() => {SetModalEditNote({isShow: false, type: "", data: null})}}
                    GetAllNotes={GetAllNotes}
                    EditToast={ToastEdit}
                    type={modalEditNote.type}
                    note={modalEditNote.data}
                />
            </ReactModal>

            <Toast 
                toast={toastMessage}
                OnClose={ToastClose}
            />
        </div>
    )
}