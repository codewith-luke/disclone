import {onMount} from "solid-js";
import {useAuth} from "../Auth";
import {A} from "@solidjs/router";

function Login() {
    const auth = useAuth();
    let loginEl: HTMLDivElement | undefined;

    onMount(async () => {
        if (!loginEl) {
            console.error("sign up element not found");
            return;
        }

        auth().mountSignIn(loginEl);
    });

    return (
        <div class="h-full flex row justify-center items-center">
            <div ref={loginEl}/>
        </div>
    );
}

export default Login;
