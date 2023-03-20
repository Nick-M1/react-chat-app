import Sidebar from "./left-layout/Sidebar";
import {useEffect, useState} from "react";
import {User} from "firebase/auth";
import ChatScreen from "./open-chat/ChatScreen";

import { motion, AnimatePresence } from "framer-motion"


type Props = {
    user: User
}

export default function MainPage({ user }: Props) {
    const [selectedChatroomId, setSelectedChatroomId] = useState<string>('')
    const [allChatrooms, setAllChatrooms] = useState<ChatRoom[]>([])

    const [mobileChatOpen, setMobileChatOpen] = useState(false)
    useEffect(() => { if (selectedChatroomId != '') setMobileChatOpen(true) }, [selectedChatroomId])
    useEffect(() => { if (!mobileChatOpen) setSelectedChatroomId('') }, [mobileChatOpen])


    const isMobile = window.innerWidth < 768;
    const initialVariants: any = (fromLeft: boolean) => {
        // if (!isMobile) return undefined
        return { x: fromLeft ? -700 : 700, display: 'block' }
    }
    const animationVariants: any = (show: boolean, fromLeft: boolean) => {
        if (!isMobile)
            return { x: 0, display: 'block' }

        return show ? {
            x: 0,
            transition: {duration: 0.3},
            display: 'block',
        } : {
            x: fromLeft ? -700 : 700,
            transition: {duration: 0.3},
            position: 'absolute',
            transitionEnd: {
                display: "none",
            }
        }
    }

    return (
        <div className="overflow-x-clip flex w-screen h-[100dvh] bg-neutral-800 text-white">
            <motion.div
                key="slider-modal"
                className={`w-screen md:w-[20vw]`}
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
                className={`w-screen md:w-[80vw]`}
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
                        />
                    </div>
                ) : (
                    <div className={`hidden md:block w-full m-auto`}>
                        <h2 className="text-2xl font-semibold text-center">
                            Click on a chat or create a new chat
                        </h2>
                    </div>
                )}
            </motion.div>
        </div>
    )

    // OLD VERSION - NO FRAMER MOTION
    // return (
    //     <div className="md:overflow-y-hidden flex w-screen h-screen bg-neutral-800 text-white">
    //         <div className={`${mobileChatOpen ? 'hidden' : 'block'} w-screen md:w-[20vw] md:block`}>
    //             <Sidebar
    //                 user={user}
    //                 selectedChatroomId={selectedChatroomId} setSelectedChatroomId={setSelectedChatroomId}
    //                 allChatrooms={allChatrooms} setAllChatrooms={setAllChatrooms}
    //             />
    //         </div>
    //
    //         { selectedChatroomId != '' ? (
    //             <div className={`${mobileChatOpen ? 'block' : 'hidden'} md:block w-screen md:w-[80vw] md:overflow-y-scroll scrollbar md:ml-auto`}>
    //                 <ChatScreen
    //                     user={user}
    //                     selectedChatroomId={selectedChatroomId}
    //                     selectedChatroom={allChatrooms.find(c => c.id == selectedChatroomId)}
    //                     setMobileChatOpen={setMobileChatOpen}
    //                 />
    //             </div>
    //         ) : (
    //             <div className={`${mobileChatOpen ? 'block' : 'hidden'} md:block w-screen md:w-[80vw] m-auto`}>
    //                 <h2 className="text-2xl font-semibold text-center">
    //                     Click on a chat or create a new chat
    //                 </h2>
    //             </div>
    //         )}
    //     </div>
    // )
}
