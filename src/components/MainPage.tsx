import Sidebar from "./left-layout/Sidebar";
import {useEffect, useState} from "react";
import {User} from "firebase/auth";
import ChatScreen from "./open-chat/ChatScreen";

type Props = {
    user: User
}

export default function MainPage({ user }: Props) {
    const [selectedChatroomId, setSelectedChatroomId] = useState<string>('')
    const [allChatrooms, setAllChatrooms] = useState<ChatRoom[]>([])

    const [mobileChatOpen, setMobileChatOpen] = useState(false)
    useEffect(() => { if (selectedChatroomId != '') setMobileChatOpen(true) }, [selectedChatroomId])
    useEffect(() => { if (!mobileChatOpen) setSelectedChatroomId('') }, [mobileChatOpen])

    return (
        <div className="md:overflow-y-hidden flex w-screen h-screen bg-neutral-800 text-white">
            <div className={`${mobileChatOpen ? 'hidden' : 'block'} w-screen md:w-[20vw] md:block`}>
                <Sidebar
                    user={user}
                    selectedChatroomId={selectedChatroomId} setSelectedChatroomId={setSelectedChatroomId}
                    allChatrooms={allChatrooms} setAllChatrooms={setAllChatrooms}
                />
            </div>

            { selectedChatroomId != '' ? (
                <div className={`${mobileChatOpen ? 'block' : 'hidden'} md:block w-screen md:w-[80vw] md:overflow-y-scroll scrollbar md:ml-auto`}>
                    <ChatScreen
                        user={user}
                        selectedChatroomId={selectedChatroomId}
                        selectedChatroom={allChatrooms.find(c => c.id == selectedChatroomId)}
                        setMobileChatOpen={setMobileChatOpen}
                    />
                </div>
            ) : (
                <div className={`${mobileChatOpen ? 'block' : 'hidden'} md:block w-screen md:w-[80vw] m-auto`}>
                    <h2 className="text-2xl font-semibold text-center">
                        Click on a chat or create a new chat
                    </h2>
                </div>
            )}
        </div>
    )
}
