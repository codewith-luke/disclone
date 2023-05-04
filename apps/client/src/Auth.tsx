import Clerk from "@clerk/clerk-js";
import {Accessor, createContext, createEffect, createResource, JSX, Resource, useContext} from "solid-js";
import {BeforeLeaveEventArgs, useBeforeLeave, useLocation, useNavigate} from "@solidjs/router";

type AuthProps = {
    children: JSX.Element
}

const UnauthorizedRoutes: {
    [key: string | number]: string | number
} = {
    "/login": "/login",
    "/signup": "/signup"
} as const;

const ClerkContext = createContext<Resource<Clerk>>();

export const useAuth = () => {
    const ctx = useContext(ClerkContext);

    if (!ctx) {
        throw new Error("No Clerk context found");
    }

    if (!ctx()) {
        throw new Error("Clerk context not loaded");
    }

    return ctx as Accessor<Clerk>;
};

async function loadClerk() {
    const clerk = new Clerk(
        "pk_test_ZWFzeS1tb29zZS0xNC5jbGVyay5hY2NvdW50cy5kZXYk"
    );
    await clerk.load();
    return clerk;
}

function isAuthenticated(clerk: () => Clerk | undefined) {
    return clerk() && clerk()?.user;
}

function Auth(props: AuthProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [clerk] = createResource(loadClerk);

    useBeforeLeave((e: BeforeLeaveEventArgs) => {
        if (!isAuthenticated(clerk) && !UnauthorizedRoutes[e.to]) {
            e.preventDefault();
            navigate("/login", {replace: true});
        }
    });

    createEffect(() => {
        if (!isAuthenticated(clerk) && !UnauthorizedRoutes[location.pathname]) {
            navigate("/login", {replace: true});
        }
    });

    return (
        <ClerkContext.Provider value={clerk}>
            {clerk() && (
                props.children
            )}
        </ClerkContext.Provider>
    );
}

export default Auth;
