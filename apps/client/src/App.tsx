import {Routes, useRoutes} from "@solidjs/router";
import {Suspense} from "solid-js";
import "./App.css";
import ".";

import Auth from "./Auth";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Channels from "./pages/Channels";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            {path: '/', component: Home},
            {path: '/channels', component: Channels},
        ]
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/signup',
        component: SignUp,
    },
]

function App() {
    const Routes = useRoutes(routes)
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Auth>
                <Routes/>
            </Auth>
        </Suspense>
    )
}

export default App;
