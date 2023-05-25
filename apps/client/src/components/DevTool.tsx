import {useClerk} from "../Auth";
import {createResource, createSignal} from "solid-js";
import ButtonPrimary from "./Button";

export default function DevTool() {
    const clerk = useClerk();
    const [token, setToken] = createSignal('')

    createResource(async () => {
        const tkn = await clerk().session?.getToken({template: 'disclone'});

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
        <ButtonPrimary class="rounded-full w-10 h-10 p-0" value="JWT" type="button" onClick={() => {
            copyValue(token() || '');
        }
        }/>
    )
}
