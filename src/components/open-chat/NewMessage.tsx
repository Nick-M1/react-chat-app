import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, {useState} from "react";
import {db} from "../../firebase";
import { v4 as uuidv4 } from 'uuid';


type Props = {
    user: User
    selectedRoomId: string
}

export default function NewMessage({ user, selectedRoomId }: Props) {
    const [formValue, setFormValue] = useState('')

    const sendMessageHander = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (user == null)
            return

        const newMessageId = uuidv4()

        await setDoc(doc(db, "rooms", selectedRoomId, "messages", newMessageId), {
            id: newMessageId,
            createdAt: Date.now(),
            text: formValue,

            user: {
                id: user.uid,
                displayname: user.displayName,
                email: user.email,
                image: user.photoURL
            } as UserType
        } as Message);

        setFormValue('')
        // todo: Scroll to scrollToBottom
    }

    return (
        <div>
            <form onSubmit={sendMessageHander}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} className='bg-gray-500'/>
                <button type='submit'>Send</button>
            </form>

            <div id='newCommentScroll'></div>
        </div>
    );
}