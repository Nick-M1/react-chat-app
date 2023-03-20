import MessageSingle from "./MessageSingle";
import NewMessage from "./NewMessage";
import {User} from "firebase/auth";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {collection, doc, onSnapshot, query, orderBy} from "firebase/firestore";
import {db} from "../../firebase";
import smoothScroll from "../../utils/smooth-scroll";
import ChatScreenHeader from "./ChatScreenHeader";

type Props = {
    user: User
    selectedChatroomId: string
    selectedChatroom: ChatRoom | undefined
    setMobileChatOpen: Dispatch<SetStateAction<boolean>>
}

export default function ChatScreen({ user, selectedChatroomId, selectedChatroom, setMobileChatOpen }: Props) {
    const [messages, setMessages] = useState<Message[]>([])
    const messagesUnsub = onSnapshot(
        query(
            collection(db, "rooms", selectedChatroomId, "messages"),
            orderBy('timestamp', 'desc')
        ),
        (doc) => {
            setMessages(doc.docs.map(dc => dc.data() as Message))
    });
    useEffect(() => { return () => messagesUnsub() }, [])


    return (
        <div className=''>
            <ChatScreenHeader selectedChatroom={selectedChatroom} setMobileChatOpen={setMobileChatOpen} />
            <div className='w-full h-[80vh] px-0.5 md:px-3 overflow-y-scroll scrollbar scroll-smooth flex flex-col-reverse'>
                <div id='end-of-messages'/>
                {messages && messages.map(msg => <MessageSingle key={msg.id} message={msg} user={user} />)}
            </div>
            <NewMessage user={user} selectedRoomId={selectedChatroomId} />
        </div>
    )
}