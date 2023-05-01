import {onMount} from "solid-js";
import {useAuth} from "../Auth";

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
        <div class="row">
            <div ref={loginEl}>
            </div>
        </div>
    );
}

export default Login;
