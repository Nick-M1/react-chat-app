import "@fontsource/montserrat";
import React, { useEffect, useState} from 'react'
import {Toaster} from "react-hot-toast";
import {auth, db} from "./firebase";
import { doc, onSnapshot, collection } from 'firebase/firestore'
import {useAuthState} from "react-firebase-hooks/auth";
import SigninButton from "./components/authentication/SigninButton";
import SignoutButton from "./components/authentication/SignoutButton";
import MessageSingle from "./components/open-chat/MessageSingle";
import NewMessage from "./components/open-chat/NewMessage";
import Sidebar from "./components/layout/Sidebar";
import ChatScreen from "./components/open-chat/ChatScreen";


export default function App() {
    const [user, userLoading, userError] = useAuthState(auth)
    const chatOpen = true

    if (userLoading)
        return <div>Loading</div>

    if (user == null)
        return <div><SigninButton/></div>

    return (
        <div className="font-montserrat md:overflow-y-hidden flex w-screen h-screen shadow-md">
            <div className="hidden w-[30vw] md:flex">
                <Sidebar user={user}/>
            </div>
            { chatOpen ? (
                <div className="w-[70vw] md:overflow-y-scroll scrollbar md:pr-2">
                    <ChatScreen user={user} />
                </div>
            ) : (
                <div className="flex-col items-center justify-center hidden m-4 text-center md:flex md:w-[63vw] h-[80vh] md:m-1 md:ml-16 rounded-xl !mt-auto !mb-auto w-[93vw] text-white">
                    <h2 className="text-2xl w-[280px] font-semibold">
                        Click on a chat or create a new chat
                    </h2>
                </div>
            )}

        </div>
    )
}
