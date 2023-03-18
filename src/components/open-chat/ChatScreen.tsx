import MessageSingle from "./MessageSingle";
import NewMessage from "./NewMessage";
import {User} from "firebase/auth";
import {useEffect, useState} from "react";
import {collection, doc, onSnapshot, query} from "firebase/firestore";
import {db} from "../../firebase";

type Props = {
    user: User
    selectedRoomId: string
}

export default function ChatScreen({ user, selectedRoomId }: Props) {

    const [messages, setMessages] = useState<Message[]>([])
    const messagesUnsub = onSnapshot(collection(db, "rooms", selectedRoomId, "messages"), (doc) => {
        setMessages(doc.docs.map(dc => dc.data() as Message))
    });
    useEffect(() => { return () => messagesUnsub() }, [])

    return (
        <div>
            {messages && messages.map(msg => <MessageSingle key={msg.id} message={msg} user={user} />)}
            <NewMessage user={user} selectedRoomId={selectedRoomId} />
        </div>
    )
    // return (
    //     <div className="flex flex-col h-screen w-[70vw]">
    //         {recipient?.name ? (
    //             <NextSeo title={`Chat with ${recipient?.name}`} />
    //         ) : (
    //             <NextSeo title={`Chat with ${recipient?.firstName}`} />
    //         )}
    //         <ChatScreenHeader
    //             recipient={recipient}
    //             recipientEmail={recipientEmail}
    //             recipientSnapshot={recipientSnapshot}
    //         />
    //
    //         <div className="p-8 pb-24 max-h-[97vh] w-full border-t-[1px] border-indigo-900 overflow-y-scroll overflow-x-hidden hidescrollbar">
    //             {showMessages()}
    //             <div ref={endOfMessagesRef} />
    //         </div>
    //
    //         <form className="flex items-center p-4 w-full dark:bg-blue-800 bg-blue-300 fixed bottom-0 rounded-b-xl border-t-[1px] border-indigo-900 z-50">
    //             <div
    //                 onClick={() => filepickerRef?.current?.click()}
    //                 className="inputIcon"
    //             >
    //                 <PaperClipIcon className="w-6 h-6 mr-2 text-gray-100 cursor-pointer" />
    //                 <input
    //                     onChange={addImageToPost}
    //                     ref={filepickerRef}
    //                     type="file"
    //                     hidden
    //                     accept="image/*"
    //                 />
    //             </div>
    //             <EmojiHappyIcon
    //                 ref={ref}
    //                 onClick={() => setIsComponentVisible(!isComponentVisible)}
    //                 className="mr-2 text-gray-100 cursor-pointer h-7 w-7 md:h-6 md:w-6"
    //             />
    //             {isComponentVisible && (
    //                 <span ref={ref} className="absolute z-50 mb-[500px]">
    //         <Picker onSelect={addEmoji} />
    //       </span>
    //             )}
    //             <MicrophoneIcon
    //                 onClick={textToSpeech}
    //                 className={`${
    //                     hearing && "text-red-500"
    //                 }     text-white h-7 w-7 md:h-6 md:w-6 cursor-pointer`}
    //             />
    //             <input
    //                 className="p-4 w-[60%] mx-2 ml-2 text-white bg-white border-none rounded-lg outline-none md:mx-4 backdrop-filter backdrop-blur-2xl bg-opacity-10"
    //                 value={input}
    //                 onChange={e => setInput(e.target.value)}
    //                 ref={focusRef}
    //                 type="text"
    //             />
    //
    //             <button
    //                 type="submit"
    //                 onClick={sendMessage}
    //                 disabled={input.trim().length === 0}
    //             >
    //                 <PaperAirplaneIcon
    //                     className={`${
    //                         input.trim().length === 0
    //                             ? "text-gray-500 cursor-not-allowed"
    //                             : "text-gray-100 cursor-pointer"
    //                     } rotate-90 h-7 w-7 md:h-6 md:w-6 mr-2`}
    //                 />
    //             </button>
    //             {imageToPost && (
    //                 <div
    //                     onClick={removeImage}
    //                     className="flex flex-col transition duration-150 transform cursor-pointer filter hover:brightness-110 hover:scale-105"
    //                 >
    //                     <div className="relative object-contain w-10 h-10">
    //                         <Image
    //                             objectFit="contain"
    //                             layout="fill"
    //                             alt={recipient?.name}
    //                             className="object-contain h-10 "
    //                             src={imageToPost}
    //                         />
    //                     </div>
    //                     <p className="text-xs text-center text-red-500">Remove</p>
    //                 </div>
    //             )}
    //         </form>
    //     </div>
    // );
}