import {useAuth} from "../Auth";
import {createResource, createSignal} from "solid-js";
import ButtonPrimary from "./Button";

export default function DevTool() {
    const auth = useAuth();
    const [token, setToken] = createSignal('')

    createResource(async () => {
        const tkn = await auth().session?.getToken();

        if (!tkn) {
            return
        }

        setToken(tkn);
    })

    function copyValue(value: string) {
        if (!value) {
            return
        }

        navigator.clipboard.writeText(value).then(r => console.log('copied token', token))
    }

    return (
        <ButtonPrimary value="Copy" type="button" onClick={() => {
            copyValue(token() || '');}
        }/>
    )
}
