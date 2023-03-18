import {auth} from "../../firebase";
import { signOut } from "firebase/auth";



export default function SignoutButton() {
    const signOutHander = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <button onClick={signOutHander} className=''>
            Sign out
        </button>
    );
}