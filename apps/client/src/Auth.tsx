import Clerk from "@clerk/clerk-js";
import {Accessor, createContext, createResource, JSX, Resource, useContext} from "solid-js";

type AuthProps = {
    children: JSX.Element
}

export const AuthContext = createContext();

export const useAuth = () => {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return auth as Resource<Clerk>;
};

function Auth(props: AuthProps) {
    const [clerk] = createResource<Clerk>(async () => {
        const clerk = new Clerk(
            "pk_test_ZWFzeS1tb29zZS0xNC5jbGVyay5hY2NvdW50cy5kZXYk"
        );
        await clerk.load();
        console.log(clerk.user);
        return clerk;
    });

    return (
        <AuthContext.Provider value={clerk}>
            <h1>Home {JSON.stringify(clerk()?.loaded)}</h1>
            {clerk() && props.children}
        </AuthContext.Provider>
    );
}

export default Auth;
