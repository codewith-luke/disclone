import {Dialog, DialogPanel, Transition, TransitionChild} from 'solid-headless'
import {Icon} from "solid-heroicons";
import {bars_3, calendar, chartPie, documentArrowDown, folder, users, xMark} from "solid-heroicons/solid";
import {createResource, createSignal, For} from "solid-js";
import {A, Outlet} from "@solidjs/router";
import Logout from "../components/Logout";
import useUser from "../hooks/user";
import {invoke} from "@tauri-apps/api";
import DevTool from "../components/DevTool";

const navigation = [
    {name: 'Dashboard', href: '#', icon: bars_3, current: false},
    {name: 'Team', href: '/channels', icon: users, current: false},
    {name: 'Projects', href: '#', icon: folder, current: false},
    {name: 'Calendar', href: '#', icon: calendar, current: false},
    {name: 'Documents', href: '#', icon: documentArrowDown, current: false},
    {name: 'Reports', href: '#', icon: chartPie, current: false},
]

function classes(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Layout() {
    const user = useUser();
    const [sidebarOpen, setSidebarOpen] = createSignal(false)

    createResource(async () => {
        const res = await invoke('greet', { name: 'World' });
    });


    function closeDialog() {
        setSidebarOpen(false);
    }

    return (
        <>
            <Transition show={sidebarOpen()}>
                <Dialog isOpen={sidebarOpen()} class="relative z-50 lg:hidden" onClose={closeDialog}>
                    <TransitionChild
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div class="fixed inset-0 bg-gray-900/80"/>
                    </TransitionChild>

                    <div class="fixed inset-0 flex">
                        <TransitionChild
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                                <TransitionChild
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button type="button" class="-m-2.5 p-2.5"
                                                onClick={() => setSidebarOpen(false)}>
                                            <span class="sr-only">Close sidebar</span>
                                            <Icon path={xMark} class="h-6 w-6 text-white" aria-hidden="true"/>
                                        </button>
                                    </div>
                                </TransitionChild>

                                <div
                                    class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                                    <div class="flex h-16 shrink-0 items-center">
                                        <img
                                            class="h-8 w-auto"
                                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                            alt="Your Company"
                                        />
                                    </div>
                                    <nav class="flex flex-1 flex-col">
                                        <ul role="list" class="-mx-2 flex-1 space-y-1">
                                            <For each={navigation}>
                                                {(item) => (
                                                    <li>
                                                        <A
                                                            href={item.href}
                                                            class={classes(
                                                                item.current
                                                                    ? 'bg-gray-800 text-white'
                                                                    : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                            )}
                                                        >
                                                            <Icon path={item.icon} class="h-6 w-6 shrink-0"
                                                                  aria-hidden={true}/>
                                                            {item.name}
                                                        </A>
                                                    </li>
                                                )}
                                            </For>
                                        </ul>
                                    </nav>


                                    <nav>
                                        <ul role="list" class="flex flex-col items-center space-y-1">
                                            <li>
                                                <Logout/>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>

            {/* NOTE: Desktop Nav*/}
            <div
                class="flex-col justify-between hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4">
                <div>
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
                        </ul>
                    </nav>
                </div>

                <nav>
                    <ul role="list" class="flex flex-col items-center space-y-1">
                        <li>
                            <Logout/>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* NOTE: Mobile Nav*/}
            <div
                class="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                <button type="button" class="-m-2.5 p-2.5 text-gray-400 lg:hidden"
                        onClick={() => setSidebarOpen(true)}>
                    <span class="sr-only">Open sidebar</span>
                    <Icon path={bars_3} class="h-6 w-6" aria-hidden="true"/>
                </button>
                <div class="flex-1 text-sm font-semibold leading-6 text-white">Dashboard</div>
                <a href="#">
                    <span class="sr-only">Your profile</span>
                    <img
                        class="h-8 w-8 rounded-full bg-gray-800"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    />
                </a>
            </div>

            <main class="h-full lg:pl-20">
                <div class="h-full xl:pl-96">
                    <div class="h-full px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
                        <Outlet/>
                    </div>
                </div>
            </main>

            <aside
                class="fixed inset-y-0 left-20 hidden w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
                <div>Hello {user().firstName}</div>
                <DevTool/>
            </aside>
        </>
    )
}
