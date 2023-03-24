import {auth} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import MainPage from "./components/MainPage";
import SigninPage from "./components/authentication/SigninPage";


export default function App() {
    const [user, userLoading, userError] = useAuthState(auth)

    // if (userLoading)
        return (
            <div className='flex flex-col justify-center items-center w-full h-screen-withmobile bg-neutral-900'>
                <h1 className='text-gray-100 font-semibold text-4xl animate-pulse'>Loading...</h1>
                <img src='/homepage-gif.gif' alt='' className='md:w-[25vw] h-[25vw] animate-pulse'/>
            </div>
        )
    // if (user == null || typeof userError != 'undefined')
    //     return <SigninPage/>
    //
    // return (
    //     <MainPage user={user}/>
    // )
}
