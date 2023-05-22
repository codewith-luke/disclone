import {useClerk} from "../Auth";

export type User = {
    firstName: string;
}

export default function useUser() {
    const clerk = useClerk();

    return () => {
        if (clerk()?.user) {
            return clerk().user as User;
        }

        return {
            firstName: 'Guest',
        }
    };
}

