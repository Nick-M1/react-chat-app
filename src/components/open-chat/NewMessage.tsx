import { User } from 'firebase/auth';
import {doc, serverTimestamp, setDoc, updateDoc} from 'firebase/firestore';
import React, {Dispatch, Fragment, SetStateAction, useState} from "react";
import {db, storage} from "../../firebase";
import {getDownloadURL, ref, uploadBytesResumable} from "@firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import GifIcon from "../icons/GifIcon";
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

function uploadFile(newMessageId: string, fileToUpload: File, handler: (input: string) => void) {
    const storageRef = ref(storage, `messages/${newMessageId}`)
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
        },
        (err) => {
            console.log(err)
            // toast.error('Profile pic upload failed', { id: 'profilepic' })
        },

        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                handler(url)
            });
        }
    );
}

function uploadMessage(selectedRoomId: string, newMessageId: string, user: User, replyToMsgId: string | null, formValueText: string) {
    async function innerFunc(formValueFileUrl: string | null = null) {
        await setDoc(doc(db, "rooms", selectedRoomId, "messages", newMessageId), {
            id: newMessageId,
            timestamp: serverTimestamp(),
            text: formValueText,
            attachedFileUrl: formValueFileUrl,

            user: {
                id: user.uid,
                displayname: user.displayName,
                email: user.email,
                image: user.photoURL
            } as UserType,

            isDeleted: false,
            replyToMsgId: replyToMsgId,
            reactions: [],
        } as Message);

        await updateDoc(doc(db, 'rooms', selectedRoomId), {
            timestamp: serverTimestamp()
        });
    }

    return innerFunc
}


export default function NewMessage({ user, selectedRoomId, replyToMsgId, setReplyToMsgId, replyToMessage, replyToMessageColor }: Props) {
    const [isSending, setIsSending] = useState(false)
    const [formValueText, setFormValueText] = useState('')
    const [formValueFile, setFormValueFile] = useState<File | null>(null)

    const sendMessageHander = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formValueText == '' || isSending)
            return

        setIsSending(true)
        const newMessageId = uuidv4()

        const uploadMessageFunction = uploadMessage(selectedRoomId, newMessageId, user, replyToMsgId, formValueText)
        formValueFile == null
            ? uploadMessageFunction()
            : uploadFile(newMessageId, formValueFile, uploadMessageFunction)

        setFormValueText('')
        setFormValueFile(null)
        setReplyToMsgId(null)
        smoothScroll(newMessageId, 'center')
        setIsSending(false)
    }

    return (
        <div className='absolute bottom-2 w-full md:w-[78vw] px-4 bg-neutral-800'>
            <form onSubmit={sendMessageHander} className='flex items-center space-x-2'>
                <div>
                    <input
                        id="picture"
                        name="picture"
                        type="file"
                        className="absolute w-8 h-8 opacity-0"
                        onChange={(e) => {
                            if (e.target.files != null && e.target.files[0].type.split('/')[0] == 'image')
                                setFormValueFile(e.target.files[0])
                        }}
                    />
                    <AddimageIcon className='w-8 h-8 shrink-0 fill-blue-100 hover:fill-blue-200 focus:fill-blue-300 cursor-pointer smooth-transition'/>

                </div>


                <PaperclipIcon className='w-7 h-7 shrink-0 fill-blue-100 hover:fill-blue-200 focus:fill-blue-300 cursor-pointer smooth-transition'/>
                <StickerIcon className='w-7 h-7 shrink-0 fill-blue-100 hover:fill-blue-200 focus:fill-blue-300 cursor-pointer smooth-transition'/>
                <GifIcon className='w-7 h-7 shrink-0 fill-blue-100 hover:fill-blue-200 focus:fill-blue-300 cursor-pointer smooth-transition'/>
                <div className='w-full relative'>
                    { formValueFile &&
                        <div className={`absolute border-2 border-blue-500 rounded-md overflow-hidden z-10 bottom-12 ${replyToMsgId != null && 'mb-[4.5rem]'}`}>
                            <img className='max-w-[30dvw] max-h-[30dvh]' src={URL.createObjectURL(formValueFile)} alt='attachment'/>
                            <div onClick={() => setFormValueFile(null)} className='absolute top-0 right-0 m-1 p-0.5 bg-neutral-600/75 hover:bg-neutral-500/50 active:bg-neutral-500 rounded-full cursor-pointer smooth-transition'>
                                <XMarkIcon className='w-5 w-5'/>
                            </div>
                        </div>
                    }

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
                            { replyToMessage?.attachedFileUrl && <img src={replyToMessage?.attachedFileUrl} alt='attachment' className='max-h-[10dvh] max-w-[20dvw] ml-auto items-end'/> }

                        </div>
                    }

                    <input
                        value={formValueText}
                        placeholder='Enter your comment...'
                        onChange={(e) => setFormValueText(e.target.value)}
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