import {useAuth} from "../Auth";
import Chat from "../components/Chat";

function Home() {
    const auth = useAuth();

    return (
        <Chat/>
    );
}

export default Home;
