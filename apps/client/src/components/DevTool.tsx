import {useAuth} from "../Auth";
import {createSignal, createResource} from "solid-js";

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
        <div>
            <span class="truncate">{token()}</span>
            <button type="button" onclick={async () => {
                copyValue(token() || '');
            }}>copy
            </button>
        </div>
    )
}
