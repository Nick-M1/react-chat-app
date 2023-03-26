import { User } from 'firebase/auth';
import {doc, serverTimestamp, setDoc, updateDoc} from 'firebase/firestore';
import React, {Dispatch, SetStateAction, useState} from "react";
import {db} from "../../firebase";
import { v4 as uuidv4 } from 'uuid';
import GifIcon from "../icons/GifIcon";
import ReplyIcon from "../icons/ReplyIcon";
import StickerIcon from "../icons/StickerIcon";
import {PaperAirplaneIcon} from "@heroicons/react/24/outline";
import smoothScroll from "../../utils/smooth-scroll";
import PaperclipIcon from "../icons/PaperclipIcon";
import AddimageIcon from "../icons/AddimageIcon";
import EmojiIcon from "../icons/EmojiIcon";
import {XMarkIcon} from "@heroicons/react/24/solid";


type Props = {
    user: User
    selectedRoomId: string

    replyToMsgId: string | null
    setReplyToMsgId: Dispatch<SetStateAction<string | null>>

    replyToMessage: Message | undefined
    replyToMessageColor: string
}

export default function NewMessage({ user, selectedRoomId, replyToMsgId, setReplyToMsgId, replyToMessage, replyToMessageColor }: Props) {
    const [isSending, setIsSending] = useState(false)
    const [formValue, setFormValue] = useState('')

    const sendMessageHander = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formValue == '' || isSending)
            return

        setIsSending(true)
        const newMessageId = uuidv4()

        await setDoc(doc(db, "rooms", selectedRoomId, "messages", newMessageId), {
            id: newMessageId,
            timestamp: serverTimestamp(),
            text: formValue,

            user: {
                id: user.uid,
                displayname: user.displayName,
                email: user.email,
                image: user.photoURL
            } as UserType,

            isDeleted: false,
            replyToMsgId: replyToMsgId
        } as Message);

        await updateDoc(doc(db, 'rooms', selectedRoomId), {
            timestamp: serverTimestamp()
        })

        setFormValue('')
        setReplyToMsgId(null)
        smoothScroll(newMessageId, 'center')
        setIsSending(false)
    }

    return (
        <div className='absolute bottom-2 w-full md:w-[78vw] px-4 bg-neutral-800'>
            <form onSubmit={sendMessageHander} className='flex items-center space-x-2'>
                <AddimageIcon className='w-8 h-8 shrink-0 fill-blue-100 hover:fill-blue-200 focus:fill-blue-300 cursor-pointer smooth-transition'/>
                <PaperclipIcon className='w-7 h-7 shrink-0 fill-blue-100 hover:fill-blue-200 focus:fill-blue-300 cursor-pointer smooth-transition'/>
                <StickerIcon className='w-7 h-7 shrink-0 fill-blue-100 hover:fill-blue-200 focus:fill-blue-300 cursor-pointer smooth-transition'/>
                <GifIcon className='w-7 h-7 shrink-0 fill-blue-100 hover:fill-blue-200 focus:fill-blue-300 cursor-pointer smooth-transition'/>
                <div className='w-full relative'>
                    { replyToMsgId != null &&
                        <div className='absolute bottom-12 bg-neutral-700 w-full h-[10dvh] overflow-y-auto overflow-x-clip scrollbar rounded-lg flex italic'>
                            <div className={`h-full w-1 bg-${replyToMessageColor} rounded-lg mr-3 flex-shrink-0`}/>
                            <div>
                                <div onClick={() => setReplyToMsgId(null)} className='absolute right-0 m-1 p-0.5 bg-neutral-600/75 hover:bg-neutral-500/50 active:bg-neutral-500 rounded-full cursor-pointer smooth-transition'>
                                    <XMarkIcon className='w-5 w-5'/>
                                </div>
                                <span className={`text-${replyToMessageColor}`}>{ replyToMessage?.user.displayname }</span>
                                <br/>
                                { replyToMessage?.text }
                            </div>
                        </div>
                    }
                    <input
                        value={formValue}
                        placeholder='Enter your comment...'
                        onChange={(e) => setFormValue(e.target.value)}
                        className='input-primary text-sm px-5'/>
                </div>
                <EmojiIcon className='absolute text-white right-20 bottom-1 w-8 h-8 fill-blue-100 hover:fill-blue-200 focus:fill-blue-300 cursor-pointer smooth-transition'/>
                <button type='submit' className='ml-0.5 btn-secondary py-2 px-3'>
                    <PaperAirplaneIcon className='w-5 h-5'/>
                </button>
            </form>
        </div>
    );
}