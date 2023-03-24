import MessageSingle from "./MessageSingle";
import NewMessage from "./NewMessage";
import {User} from "firebase/auth";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {collection, doc, onSnapshot, query, orderBy, deleteDoc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import smoothScroll from "../../utils/smooth-scroll";
import ChatScreenHeader from "./ChatScreenHeader";
import {AnimatePresence, motion} from "framer-motion";
import PopupCustom from "../shared-components/PopupCustom";
import {TrashIcon} from "@heroicons/react/24/outline";

type Props = {
    user: User
    selectedChatroomId: string
    selectedChatroom: ChatRoom | undefined
    setMobileChatOpen: Dispatch<SetStateAction<boolean>>
}

export default function ChatScreen({ user, selectedChatroomId, selectedChatroom, setMobileChatOpen }: Props) {
    const [messageToDelete, setMessageToDelete] = useState<string | null>(null)
    const [deleteMessagePopup, setDeleteMessagePopup] = useState(false)
    useEffect(() => {
        if (messageToDelete != null)
            setDeleteMessagePopup(true)
        }, [messageToDelete])

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


    const deleteMessageHandler = async() => {
        if (messageToDelete != null)
            await updateDoc(
                doc(db, "rooms", selectedChatroomId, "messages", messageToDelete),
                { isDeleted: true }
            )
    }


    // return (
    //     <div className=''>
    //         <ChatScreenHeader selectedChatroom={selectedChatroom} setMobileChatOpen={setMobileChatOpen} />
    //         <div className='w-full h-[80dvh] lg:h-[80vh] px-0.5 md:px-3 overflow-y-scroll scrollbar scroll-smooth flex flex-col-reverse'>
    //             <div id='end-of-messages'/>
    //             {messages && messages.map(msg => <MessageSingle key={msg.id} message={msg} user={user} />)}
    //         </div>
    //         <NewMessage user={user} selectedRoomId={selectedChatroomId} />
    //     </div>
    // )

    return (
        <>
            <div className=''>
                <ChatScreenHeader selectedChatroom={selectedChatroom} setMobileChatOpen={setMobileChatOpen} />
                <div className='w-full h-[80dvh] lg:h-[80vh] px-0.5 md:px-3 overflow-y-scroll scrollbar scroll-smooth flex flex-col-reverse'>
                    <div id='end-of-messages'/>
                    <AnimatePresence
                        initial={false}
                        mode='popLayout'
                    >
                        {messages.map(message => (
                            <motion.div
                                key={message.id}
                                className={``}
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            >
                                <MessageSingle key={message.id} message={message} user={user} setMessageToDelete={setMessageToDelete} />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                </div>
                <NewMessage user={user} selectedRoomId={selectedChatroomId} />
            </div>

            <PopupCustom
                modal={deleteMessagePopup}
                setModal={setDeleteMessagePopup}
                confirmHandler={deleteMessageHandler}
                titleText={'Delete Message'}
                descriptionText={'Are you sure you want to delete this message'}
                buttonText={'Delete'}
                IconImg={TrashIcon}
            />
        </>
    )
}