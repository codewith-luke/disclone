import {onMount} from "solid-js";
import {useClerk} from "../Auth";

function Login() {
    const clerk = useClerk();
    let loginEl: HTMLDivElement | undefined;

    onMount(async () => {
        if (!loginEl) {
            console.error("sign up element not found");
            return;
        }

        clerk().mountSignIn(loginEl);
    });

    return (
        <div class="h-full flex row justify-center items-center">
            <div ref={loginEl}/>
        </div>
    );
}

export default Login;
