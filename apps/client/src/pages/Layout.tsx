import {Icon} from "solid-heroicons";
import {users} from "solid-heroicons/solid";
import {createResource, For} from "solid-js";
import {A, Outlet} from "@solidjs/router";
import Logout from "../components/Logout";
import {invoke} from "@tauri-apps/api";
import DevTool from "../components/DevTool";
import {CHAT_IDENTIFIER} from "../components/Chat";

const navigation = [
    {name: 'Team', href: '/channels', icon: users, current: false},
]

function classes(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Layout() {
    createResource(async () => {
        const res = await invoke('greet', {name: 'World'});
    });

    return (
        <div class="h-screen flex flex-col justify-between">
            <main class="relative flex flex-row flex-1 overflow-hidden">
                <div
                    class="flex-col h-full z-50 flex w-20 bg-background-primary">
                    <div class="flex h-16 shrink-0 items-center justify-center">
                        <img
                            class="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                            alt="Your Company"
                        />
                    </div>
                    <nav class="mt-8">
                        <ul role="list" class="flex flex-col items-center space-y-1">
                            <For each={navigation}>
                                {(item) => (
                                    <li>
                                        <A
                                            href={item.href}
                                            class={classes(
                                                item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold'
                                            )}
                                        >
                                            <Icon path={item.icon} class="h-6 w-6 shrink-0" aria-hidden="true"/>
                                            <span class="sr-only">{item.name}</span>
                                        </A>
                                    </li>
                                )}
                            </For>
                            <li>
                                <DevTool/>
                            </li>
                        </ul>
                    </nav>
                </div>

                <aside
                    class="flex flex-col bg-background-tertiary rounded-bl-3xl inset-y-0 left-20 w-72 overflow-y-auto ">
                    <div class="h-16 border-b-4 border-border">
                    </div>
                    <div class="flex flex-1 flex-col">
                        <div class="mt-8">
                        </div>
                    </div>
                </aside>

                <div class="h-full flex flex-1 flex-col overflow-hidden">
                    <Outlet/>
                </div>
            </main>
            <footer class="h-16 flex flex-row">
                <div class="w-20 flex items-center justify-center">
                    <nav>
                        <ul role="list" class="flex flex-col items-center space-y-1">
                            <li>
                                <Logout/>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div class="w-72"/>
                <div class="flex-1 flex items-center justify-center">
                    <div id={CHAT_IDENTIFIER} class="flex justify-center items-center h-full bg-background-primary w-full"/>
                </div>
            </footer>
        </div>
    )
}
