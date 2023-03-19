import { User } from 'firebase/auth';
import {doc, serverTimestamp, setDoc, updateDoc} from 'firebase/firestore';
import React, {useState} from "react";
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


type Props = {
    user: User
    selectedRoomId: string
}

export default function NewMessage({ user, selectedRoomId }: Props) {
    const [formValue, setFormValue] = useState('')

    const sendMessageHander = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formValue == '')
            return

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
            } as UserType
        } as Message);

        await updateDoc(doc(db, 'rooms', selectedRoomId), {
            timestamp: serverTimestamp()
        })

        setFormValue('')
        smoothScroll(newMessageId, 'center')
    }

    return (
        <div className='absolute bottom-2 w-full md:w-[78vw] px-4'>
            <form onSubmit={sendMessageHander} className='flex items-center space-x-2'>
                <AddimageIcon className='w-8 h-8 shrink-0 fill-blue-100 hover:fill-blue-200 focus:fill-blue-300 cursor-pointer smooth-transition'/>
                <PaperclipIcon className='w-7 h-7 shrink-0 fill-blue-100 hover:fill-blue-200 focus:fill-blue-300 cursor-pointer smooth-transition'/>
                <StickerIcon className='w-7 h-7 shrink-0 fill-blue-100 hover:fill-blue-200 focus:fill-blue-300 cursor-pointer smooth-transition'/>
                <GifIcon className='w-7 h-7 shrink-0 fill-blue-100 hover:fill-blue-200 focus:fill-blue-300 cursor-pointer smooth-transition'/>
                <input
                    value={formValue}
                    placeholder='Enter your comment...'
                    onChange={(e) => setFormValue(e.target.value)}
                    className='input-primary text-sm px-5'/>
                <EmojiIcon className='absolute text-white right-20 bottom-1 w-8 h-8 fill-blue-100 hover:fill-blue-200 focus:fill-blue-300 cursor-pointer smooth-transition'/>
                <button type='submit' className='ml-0.5 btn-secondary py-2 px-3'>
                    <PaperAirplaneIcon className='w-5 h-5'/>
                </button>
            </form>
        </div>
    );
}