import MessageSingle from "./MessageSingle";
import NewMessage from "./NewMessage";
import {User} from "firebase/auth";
import {useEffect, useState} from "react";
import {collection, doc, onSnapshot, query, orderBy} from "firebase/firestore";
import {db} from "../../firebase";
import smoothScroll from "../../utils/smooth-scroll";

type Props = {
    user: User
    selectedChatroomId: string
}

export default function ChatScreen({ user, selectedChatroomId }: Props) {
    const [previousChatroomId, setPreviousChatroomId] = useState<string>('')

    const [messages, setMessages] = useState<Message[]>([])
    const messagesUnsub = onSnapshot(
        query(
            collection(db, "rooms", selectedChatroomId, "messages"),
            orderBy('timestamp', 'asc')
        ),
        (doc) => {
            setMessages(doc.docs.map(dc => dc.data() as Message))

            if (previousChatroomId != selectedChatroomId) {
                setTimeout(() => smoothScroll('end-of-messages', 'center', false), 0.5)
                setTimeout(() => smoothScroll('end-of-messages', 'center', false), 8)
                setPreviousChatroomId(selectedChatroomId)
            }
    });
    useEffect(() => { return () => messagesUnsub() }, [])

    return (
        <div className=''>
            <div className='w-full h-[90vh] px-0.5 md:px-3 overflow-y-scroll scrollbar'>
                {messages && messages.map(msg => <MessageSingle key={msg.id} message={msg} user={user} />)}
                <div id='end-of-messages'/>
            </div>
            <NewMessage user={user} selectedRoomId={selectedChatroomId} />
        </div>
    )
}