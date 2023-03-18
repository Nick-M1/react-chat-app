import React from 'react';
import {auth, db, googleProvider} from "../../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";



export default function SigninButton() {
    const signInWithGoogle = () => {
        signInWithPopup(auth, googleProvider)
            .then(async (result) => {
                const user = result.user;
                await setDoc(doc(db, "users", user.uid), {
                    id: user.uid,
                    displayname: user.displayName,
                    email: user.email,
                    image: user.photoURL
                } as UserType);
            });
    }

    return (
        <button onClick={signInWithGoogle} className='btn-primary'>
            Sign in with Google
        </button>
    );
}