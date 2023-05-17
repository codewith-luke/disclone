import {Icon} from "solid-heroicons";
import {paperAirplane} from "solid-heroicons/solid";
import {createSignal, For, onMount} from "solid-js";
import {useForm} from "../hooks/form";
import ButtonPrimary from "./Button";
import {Portal} from "solid-js/web";

type MessageProps = {
    text: string
}

type ChatInputProps = {
    onSubmit: (ref: HTMLFormElement) => Promise<string | void>
}
export const CHAT_IDENTIFIER = "chat-input" as const;

export default function Chat() {
    let chatArea: HTMLDivElement | undefined;
    const [messages, setMessages] = createSignal<string[]>([]);
    const [expectedMessage, setExpectedMessage] = createSignal(false);

    onMount(() => {
        function dial() {
            const conn = new WebSocket(`ws://localhost:8000/subscribe`);

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
            const resp = await fetch("http://localhost:8000/publish", {
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
            <div class="h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-teal-800">
                <div ref={chatArea}
                     class="flex flex-col ">
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
              class="flex">
            <input use:validate
                   name="message"
                   id="message-input"
                   type="text"
                   minlength="1"
                   class="flex-grow appearance-none rounded-md border border-gray-300 bg-background-secondary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ButtonPrimary value="Submit" type="submit">
                <Icon path={paperAirplane} class="h-6 w-6 shrink-0" aria-hidden="true"/>
            </ButtonPrimary>
        </form>
    )
}

function Message(props: MessageProps) {
    return (
        <p>{props.text}</p>
    )
}
