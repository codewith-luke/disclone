import {Route, Routes} from "@solidjs/router";

import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Channels from "./pages/Channels";
import {Suspense} from "solid-js";
import Auth from "./Auth";

function App() {
    return (
        <div class="container">
            <Suspense fallback={<div>Loading...</div>}>
                <Auth>
                    <h1>Welcome to Disclone!</h1>
                    <Routes>
                        <Route path="/" component={Home}/>
                        <Route path="/channels" component={Channels}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/signup" component={SignUp}/>
                    </Routes>
                </Auth>
            </Suspense>
        </div>
    );
}

export default App;
