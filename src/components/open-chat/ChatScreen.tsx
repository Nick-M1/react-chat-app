import MessageSingle from "./MessageSingle";
import NewMessage from "./NewMessage";
import {User} from "firebase/auth";
import {useEffect, useState} from "react";
import {collection, doc, onSnapshot, query, orderBy} from "firebase/firestore";
import {db} from "../../firebase";
import smoothScroll from "../../utils/smooth-scroll";

type Props = {
    user: User
    selectedRoomId: string
}

export default function ChatScreen({ user, selectedRoomId }: Props) {

    const [messages, setMessages] = useState<Message[]>([])
    const messagesUnsub = onSnapshot(
        query(
            collection(db, "rooms", selectedRoomId, "messages"),
            orderBy('timestamp', 'asc')
        ),
        (doc) => {
        setMessages(doc.docs.map(dc => dc.data() as Message))
    });
    useEffect(() => { return () => messagesUnsub() }, [])

    return (
        <div className=''>
            <button onClick={() => smoothScroll('end-of-messages', 'center', true)}>HHHHHHHHH</button>
            <div className=' h-[90vh] px-3 overflow-y-scroll scrollbar'>
                {messages && messages.map(msg => <MessageSingle key={msg.id} message={msg} user={user} />)}
                <div id='end-of-messages'/>
            </div>
            <NewMessage user={user} selectedRoomId={selectedRoomId} />
        </div>
    )
}