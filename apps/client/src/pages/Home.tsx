import {A} from "@solidjs/router";
import {useAuth} from "../Auth";

function Home() {
    const auth = useAuth();

    return (
        <div>
            <h1>Home {JSON.stringify(auth().loaded)}</h1>
            <A href="/Channels">Channels</A>
        </div>
    );
}

export default Home;
