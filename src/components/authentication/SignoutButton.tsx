import {auth} from "../../firebase";
import { signOut } from "firebase/auth";



export default function SignoutButton() {
    const signOutHandler = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <button onClick={signOutHandler} className='btn-primary'>
            Sign out
        </button>
    );
}