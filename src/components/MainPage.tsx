import Sidebar from "./left-layout/Sidebar";
import {KeyboardEvent, useCallback, useEffect, useState} from "react";
import {User} from "firebase/auth";
import ChatScreen from "./open-chat/ChatScreen";

import { motion, AnimatePresence } from "framer-motion"


type Props = {
    user: User
}

export default function MainPage({ user }: Props) {
    const isMobile = window.innerWidth < 768;
    const [replyToMsgId, setReplyToMsgId] = useState<string | null>(null)

    const [selectedChatroomId, setSelectedChatroomId] = useState<string>('')
    const [allChatrooms, setAllChatrooms] = useState<ChatRoom[]>([])

    const [mobileChatOpen, setMobileChatOpen] = useState(false)
    useEffect(() => {
        if (selectedChatroomId != '') {
            setMobileChatOpen(true)
            setReplyToMsgId(null)
        }
    }, [selectedChatroomId])

    useEffect(() => {
        if (!mobileChatOpen)
            setSelectedChatroomId('')
    }, [mobileChatOpen])


    // Back button on mobile
    useEffect(() => {
        function onBackButtonEvent(e: PopStateEvent) {
            if (!mobileChatOpen) {
                setMobileChatOpen(false)
                e.preventDefault()
                history.go(1);
            }
        }

        window.history.pushState(null, '', window.location.pathname);
        window.addEventListener('popstate', onBackButtonEvent);
        return () => {
            window.removeEventListener('popstate', onBackButtonEvent);
        };
    }, []);


    // Animations for framer-motion
    const initialVariants: any = (fromLeft: boolean) => {
        // if (!isMobile) return undefined
        return { x: fromLeft ? -700 : 700, display: 'block', height: '100dvh' }
    }
    const animationVariants: any = (show: boolean, fromLeft: boolean) => {
        if (!isMobile)
            return { x: 0, display: 'block' }

        return show ? {
            x: 0,
            transition: {duration: 0.3},
            display: 'block',
            height: '100dvh'
        } : {
            x: fromLeft ? -700 : 700,
            height: '100dvh',
            transition: {duration: 0.3},
            position: 'absolute',
            transitionEnd: {
                display: "none",
            }
        }
    }



    return (
        <div className="overflow-x-clip flex w-screen h-screen-withmobile bg-neutral-800 text-white">
            <motion.div
                key="slider-modal"
                className={`w-screen md:w-[20vw] `}
                initial={ initialVariants(true) }
                animate={ animationVariants(!mobileChatOpen, true) }
                transition={{ type: "just" }}
            >
                <Sidebar
                    user={user}
                    selectedChatroomId={selectedChatroomId} setSelectedChatroomId={setSelectedChatroomId}
                    allChatrooms={allChatrooms} setAllChatrooms={setAllChatrooms}
                />
            </motion.div>

            <motion.div
                key="mainchat-modal"
                className={`w-screen md:w-[80vw] overflow-x-clip`}
                initial={ initialVariants(false) }
                animate={ animationVariants(mobileChatOpen, false) }
                transition={{ type: "just" }}
            >
                { selectedChatroomId != '' ? (
                    <div className={`w-full md:ml-auto md:overflow-y-scroll scrollbar `}>
                        <ChatScreen
                            user={user}
                            selectedChatroomId={selectedChatroomId}
                            selectedChatroom={allChatrooms.find(c => c.id == selectedChatroomId)}
                            setMobileChatOpen={setMobileChatOpen}
                            replyToMsgId={replyToMsgId}
                            setReplyToMsgId={setReplyToMsgId}
                        />
                    </div>
                ) : (
                    <div className={`hidden md:flex flex-col w-full pt-20 ml-auto items-center`}>
                        <h2 className="text-3xl font-semibold text-center">
                            Click on a chat or start a new chat
                        </h2>
                        <img src='/homepage-gif.gif' alt='' className='md:w-[25vw] h-[25vw] content-center'/>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
