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
import colorMapper from "../../utils/user-colors";

type Props = {
    user: User
    selectedChatroomId: string
    selectedChatroom: ChatRoom | undefined
    setMobileChatOpen: Dispatch<SetStateAction<boolean>>

    replyToMsgId: string | null
    setReplyToMsgId: Dispatch<SetStateAction<string | null>>
}

export default function ChatScreen({ user, selectedChatroomId, selectedChatroom, setMobileChatOpen, replyToMsgId, setReplyToMsgId }: Props) {

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

    // Assign color to each person in room      //todo: USE MEMO
    const colorMap = new Map(
        selectedChatroom?.users.map((user, index) => [user.id, colorMapper(index)])
    )

    return (
        <>
            <div className=''>
                <ChatScreenHeader selectedChatroom={selectedChatroom} setMobileChatOpen={setMobileChatOpen} />
                <div className='w-full px-0.5 md:px-3 overflow-y-scroll scrollbar scroll-smooth flex flex-col-reverse h-[80dvh] lg:h-[80vh]'>
                    <div id='end-of-messages' className={replyToMsgId != null ? 'py-8' : ''}></div>
                    <AnimatePresence
                        initial={false}
                        mode='popLayout'
                    >
                        {messages.map(message => {
                            const messageItIsReplyingTo = typeof message.replyToMsgId != 'undefined' ? messages.find(msg => msg.id === message.replyToMsgId) : undefined

                            return (
                                <motion.div
                                    key={message.id}
                                    className={``}
                                    initial={{opacity: 0, y: 100}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, transition: {duration: 0.15}}}
                                >
                                    <MessageSingle
                                        key={message.id}
                                        message={message}
                                        messageItIsReplyingTo={messageItIsReplyingTo}

                                        colorOfThisMessage={colorMap.get(message.user.id) || 'text-indigo-300'}
                                        colorOfMessageItIsReplyingTo={typeof messageItIsReplyingTo != 'undefined' ? colorMap.get(messageItIsReplyingTo.user.id) : undefined}

                                        user={user}
                                        setMessageToDelete={setMessageToDelete}
                                        setReplyToMsgId={setReplyToMsgId}

                                    />
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                <NewMessage
                    user={user}
                    selectedRoomId={selectedChatroomId}
                    replyToMsgId={replyToMsgId}
                    setReplyToMsgId={setReplyToMsgId}
                    replyToMessage={messages.find(msg => msg.id === replyToMsgId)}
                />
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