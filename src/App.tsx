import {auth} from "./firebase";
import MainPage from "./components/MainPage";
import SigninPage from "./components/authentication/SigninPage";
import useAuthState from "./hooks/useAuthState";


export default function App() {
    const [user, userLoading, userError] = useAuthState(auth)

    if (userLoading)
        return (
            <div className='flex flex-col justify-center items-center w-full h-screen-withmobile bg-neutral-900'>
                <h1 className='text-gray-100 font-semibold text-4xl animate-pulse'>Loading...</h1>
                <img src='/homepage-gif.gif' alt='' className='w-[75vw] md:w-[30vw] animate-pulse'/>
            </div>
        )
    if (user == null || typeof userError != 'undefined')
        return <SigninPage/>

    return (
        <MainPage user={user}/>
    )
}
