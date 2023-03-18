import {auth} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import SigninButton from "./components/authentication/SigninButton";
import MainPage from "./components/MainPage";


export default function App() {
    const [user, userLoading, userError] = useAuthState(auth)

    if (userLoading)
        return <div>Loading</div>
    if (user == null)
        return <div><SigninButton/></div>

    return (
        <MainPage user={user}/>
    )
}
