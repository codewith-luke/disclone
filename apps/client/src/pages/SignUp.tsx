import {onMount} from "solid-js";

function SignUp() {
    let signUpEl: HTMLDivElement | undefined;

    onMount(async () => {
        if (!signUpEl) {
            console.error("sign up element not found");
            return;
        }
    });

    return (
        <div class="row">
            <div ref={signUpEl}></div>
        </div>
    );
}

export default SignUp;
