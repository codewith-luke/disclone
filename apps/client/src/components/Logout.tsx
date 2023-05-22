import {Icon} from "solid-heroicons";
import {arrowLeftOnRectangle} from "solid-heroicons/solid";
import {useClerk} from "../Auth";
import {useNavigate} from "@solidjs/router";

export default function Logout() {
    const navigate = useNavigate();
    const clerk = useClerk();

    async function signOut() {
        await clerk().signOut();
        navigate("/login", {replace: true})
    }

    return <button
        onClick={signOut}
        class="text-gray-400 hover:text-white hover:bg-gray-800 group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold inactive">
        <Icon path={arrowLeftOnRectangle} class="h-6 w-6 shrink-0" aria-hidden="true"/>
        <span class="sr-only">Logout</span>
    </button>;
}
