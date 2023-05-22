import {onMount} from "solid-js";
import {useClerk} from "../Auth";

function SignUp() {
    const clerk = useClerk();
    let signUpEl: HTMLDivElement | undefined;

    onMount(async () => {
        if (!signUpEl) {
            console.error("sign up element not found");
            return;
        }

        clerk().mountSignUp(signUpEl);
    });

    return (
        <div class="h-full flex row justify-center items-center">
            <div ref={signUpEl}></div>
        </div>
    );
}

export default SignUp;
