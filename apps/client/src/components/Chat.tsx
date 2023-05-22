import {createSignal, For, onMount} from "solid-js";
import {useForm} from "../hooks/form";
import {Portal} from "solid-js/web";
import {Avatar} from "@boringer-avatars/solid";
import {useClerk} from "../Auth";

type MessageProps = {
    text: string
}

type ChatInputProps = {
    onSubmit: (ref: HTMLFormElement) => Promise<string | void>
}

export const CHAT_IDENTIFIER = "chat-input" as const;

export default function Chat() {
    const clerk = useClerk();
    let chatArea: HTMLDivElement | undefined;
    const [messages, setMessages] = createSignal<string[]>([]);
    const [expectedMessage, setExpectedMessage] = createSignal(false);

    onMount(() => {
        async function dial() {
            const tkn = await clerk().session?.getToken();
            debugger;
            const otp = await fetch("http://localhost:8000/chat/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tkn}`
                }
            })
                .then((resp) => {
                    if (resp.status !== 202) {
                        throw new Error(`Unexpected HTTP Status ${resp.status} ${resp.statusText}`)
                    }
                    return resp.text();
                })
                .catch((err) => {
                    console.error("failed to auth chat", err);
                    return "";
                });

            const conn = new WebSocket(`ws://localhost:8000/chat/subscribe?otp=${otp}`);

            conn.addEventListener("close", (ev) => {
                console.error("websocket disconnected", ev);

                if (ev.code !== 1001) {
                    setMessages([...messages(), "Reconnecting in 1s"]);
                    setTimeout(dial, 1000);
                }
            });

            conn.addEventListener("open", (ev) => {
                console.info("websocket connected");
            });

            conn.addEventListener("message", (ev) => {
                if (typeof ev.data !== "string") {
                    console.error("unexpected message type", typeof ev.data);
                    return;
                }

                console.log("received message", ev.data);
                setMessages([...messages(), ev.data]);

                if (expectedMessage()) {
                    if (chatArea !== undefined) {
                        chatArea.scrollIntoView();
                    }

                    setExpectedMessage(false);
                }
            });
        }

        dial();
    });

    async function onSendMessage(ref: HTMLFormElement) {
        setExpectedMessage(true);
        const form = new FormData(ref);
        const message = form.get('message');
        try {
            const resp = await fetch("http://localhost:8000/chat/publish", {
                method: "POST",
                body: message,
            });

            if (resp.status !== 202) {
                throw new Error(`Unexpected HTTP Status ${resp.status} ${resp.statusText}`)
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                return `Publish failed: ${err.message}`;
            }
        }
    }

    return (
        <>
            <div class="h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-teal-800 px-10">
                <div ref={chatArea}
                     class="space-y-2">
                    <Message text={"Welcome to the chat!"}/>
                    <Message
                        text={"dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"}/>
                    <For each={messages()}>
                        {
                            (message) => <Message text={message}/>
                        }
                    </For>
                </div>
            </div>
            <Portal mount={document.getElementById(CHAT_IDENTIFIER) as HTMLDivElement}>
                <ChatInput onSubmit={onSendMessage}/>
            </Portal>
        </>
    )
}

export function ChatInput(props: ChatInputProps) {
    const {submit, validate} = useForm({
        errorClass: "error-input"
    });

    return (
        <form use:submit={props.onSubmit}
              reset={true}
              class="flex space-x-4 px-40">
            <input use:validate
                   name="message"
                   id="message-input"
                   type="text"
                   minlength="1"
                   placeholder="Message /commands /help"
                   class="flex-grow text-white rounded-3xl bg-background-secondary px-4 py-2"
            />
        </form>
    )
}

function Message(props: MessageProps) {
    return (
        <div class="p-4 space-y-2 max-w-[50%] break-normal">
            <h3 class="flex flex-row gap-x-1 items-center">
                <Avatar
                    size={25}
                    variant="beam"
                    name="John Doe"
                    square={false}
                    colors={["#FFAD08", "#EDD75A", "#73B06F", "#0C8F8F", "#405059"]}
                />
                <span>
                    User
                    <span class="ml-4 text-xs text-gray-400">
                                       {new Date().toLocaleTimeString()}
                                    </span>
                </span>

            </h3>
            <div
                class="relative inline-flex text-white bg-background-tertiary p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl items-center break-all">
                {props.text}

            </div>
        </div>
    )
}
