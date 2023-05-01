import {onMount} from "solid-js";
import {useAuth} from "../Auth";
import {A} from "@solidjs/router";

function SignUp() {
    const auth = useAuth();
    let signUpEl: HTMLDivElement | undefined;

    onMount(async () => {
        if (!signUpEl) {
            console.error("sign up element not found");
            return;
        }

        auth().mountSignUp(signUpEl);
    });

    return (
        <div class="h-full flex row justify-center items-center">
            <div ref={signUpEl}></div>
        </div>
    );
}

export default SignUp;
