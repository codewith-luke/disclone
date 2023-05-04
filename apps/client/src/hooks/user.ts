import {useAuth} from "../Auth";

export type User = {
    firstName: string;
}

export default function useUser() {
    const auth = useAuth();

    return () => {
        if (auth()?.user) {
            return auth().user as User;
        }

        return {
            firstName: 'Guest',
        }
    };
}

