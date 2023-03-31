import Sidebar from "./left-layout/Sidebar";
import {KeyboardEvent, lazy, Suspense, useCallback, useEffect, useState} from "react";
import {User} from "firebase/auth";
// import ChatScreen from "./open-chat/ChatScreen";

import { motion } from "framer-motion"
// import {db, messaging} from "../firebase";
// import {doc, setDoc} from "firebase/firestore";
// import {getToken, onMessage} from "firebase/messaging";
import {useStoreChatrooms} from "../store";
import {shallow} from "zustand/shallow";

const ChatScreen = lazy(() => import("./open-chat/ChatScreen"))

// // Saves the messaging device token to Cloud Firestore.
// async function saveMessagingDeviceToken(user: User) {
//     try {
//         const currentToken = await getToken(messaging, {vapidKey: 'BMxu7wGeQg-bTFQY0wwdAwjVxN1o1yIzF6TTZsdlAAzwdkBxQpANgGKlEUDG7XsZ8hfltC2KCJ90UJvrMiZtVV4'});
//         if (currentToken) {
//             console.log('Got FCM device token:', currentToken);
//             // Saving the Device Token to Cloud Firestore.
//             const tokenRef = doc(db, 'fcmTokens', currentToken);
//             await setDoc(tokenRef, { uid: user.uid });
//
//             // This will fire when a message is received while the app is in the foreground.
//             // When the app is in the background, firebase-messaging-sw.js will receive the message instead.
//             onMessage(messaging, (message) => {
//                 console.log(
//                     'New foreground notification from Firebase Messaging!',
//                     message.notification
//                 );
//             });
//         } else {
//             // Need to request permissions to show notifications.
//             requestNotificationsPermissions(user);
//         }
//     } catch(error) {
//         console.error('Unable to get messaging token.', error);
//     }
// }
//
// // Requests permissions to show notifications.
// async function requestNotificationsPermissions(user: User) {
//     console.log('Requesting notifications permission...');
//     const permission = await Notification.requestPermission();
//
//     if (permission === 'granted') {
//         console.log('Notification permission granted.');
//         // Notification permission granted.
//         await saveMessagingDeviceToken(user);
//     } else {
//         console.log('Unable to get permission to notify.');
//     }
// }

type Props = {
    user: User
}

export default function MainPage({ user }: Props) {
    const isMobile = window.innerWidth < 768;
    const [replyToMsgId, setReplyToMsgId] = useState<string | null>(null)

    const [selectedChatroom, setSelectedChatroom] = useState<ChatRoom | null>(null)
    const [allChatrooms, setAllChatrooms] = useState<ChatRoom[]>([])


    const [mobileChatOpen, setMobileChatOpen] = useState(false)
    const updateChatroomTimestampStore = useStoreChatrooms((state) => state.updateChatroomTimestamp, shallow)
    useEffect(() => {
        if (selectedChatroom != null) {
            setMobileChatOpen(true)         //todo: setEmojIPicker to false
            setReplyToMsgId(null)
            updateChatroomTimestampStore(selectedChatroom.id, Date.now())
        }
    }, [selectedChatroom])

    useEffect(() => {
        if (!mobileChatOpen)
            setSelectedChatroom(null)
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

    // useEffect(() => {
    //     saveMessagingDeviceToken(user)
    // }, [])




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
                    selectedChatroom={selectedChatroom} setSelectedChatroom={setSelectedChatroom}
                    allChatrooms={allChatrooms} setAllChatrooms={setAllChatrooms}
                />
            </motion.div>

            <motion.div
                key="mainchat-modal"
                className={`${selectedChatroom ? 'w-screen' : ''} md:w-[80vw] overflow-x-clip`}
                initial={ initialVariants(false) }
                animate={ animationVariants(mobileChatOpen, false) }
                transition={{ type: "just" }}
            >
                { selectedChatroom != null ? (
                    <Suspense fallback={<HomeComponent/>}>
                        <div className={`w-full md:ml-auto md:overflow-y-scroll scrollbar `}>
                            <ChatScreen
                                user={user}
                                selectedChatroom={selectedChatroom}
                                setMobileChatOpen={setMobileChatOpen}
                                replyToMsgId={replyToMsgId}
                                setReplyToMsgId={setReplyToMsgId}
                            />
                        </div>
                    </Suspense>
                ) : (
                    <HomeComponent/>
                )}
            </motion.div>
        </div>
    )
}


function HomeComponent() {
    return (
        <div className={`hidden md:flex flex-col w-full pt-20 ml-auto items-center`}>
            <h2 className="text-3xl font-semibold text-center">
                Click on a chat or start a new chat
            </h2>
            <img src='/homepage-gif.gif' alt='' className='md:w-[25vw] h-[25vw] content-center'/>
        </div>
    )
}