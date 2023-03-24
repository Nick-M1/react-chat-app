import {auth} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import MainPage from "./components/MainPage";
import SigninPage from "./components/authentication/SigninPage";


export default function App() {
    const [user, userLoading, userError] = useAuthState(auth)

    if (userLoading)
        return <div>Loading</div>
    if (user == null)
        return <SigninPage/>

    return (
        <MainPage user={user}/>
    )
}
