import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, {useState} from "react";
import {db} from "../../firebase";
import { v4 as uuidv4 } from 'uuid';


type Props = {
    user: User
}

export default function NewMessage({ user }: Props) {
    const [formValue, setFormValue] = useState('')

    const sendMessageHander = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (user == null)
            return

        const newMessageId = uuidv4()

        await setDoc(doc(db, "rooms", "1lTRvv37HHKpE0iarqOI", "messages", newMessageId), {
            id: newMessageId,
            createdAt: Date.now(),
            text: formValue,

            userId: user.uid,
            userDisplayname: user.displayName,
            userImage: user.photoURL
        } as Message);

        setFormValue('')
        // todo: Scroll to scrollToBottom
    }

    return (
        <div>
            <form onSubmit={sendMessageHander}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
                <button type='submit'>Send</button>
            </form>

            <div id='newCommentScroll'></div>
        </div>
    );
}