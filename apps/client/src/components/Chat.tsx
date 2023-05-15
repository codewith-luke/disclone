import {createResource, createSignal, For, onMount} from "solid-js";
import {useForm} from "../hooks/form";

type MessageProps = {
    text: string
}

export default function Chat() {
    let chatArea;
    const [messages, setMessages] = createSignal([]);
    const [expectedMessage, setExpectedMessage] = createSignal(false);
    const {submit, validate} = useForm({
        errorClass: "error-input"
    });

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
                    chatArea.scrollIntoView();
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
        } catch (err) {
            return `Publish failed: ${err.message}`;
        }
    }

    return (
        <div class="flex flex-col justify-between w-full h-full max-w-2xl">
            <div ref={chatArea} class="flex flex-col">
                <For each={messages()}>
                    {
                        (message) => <Message text={message}/>
                    }
                </For>
            </div>
            <div class="mt-6">
                <form use:submit={onSendMessage}
                      reset={true}
                      class="flex">
                    <input use:validate
                           name="message"
                           id="message-input"
                           type="text"
                           minlength="1"
                           class="flex-grow appearance-none rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <input value="Submit" type="submit"
                           class="ml-4 px-4 py-2 text-white bg-black rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-500 active:bg-red-500"/>
                </form>
            </div>
        </div>
    )
}

function Message(props: MessageProps) {
    return (
        <p>{props.text}</p>
    )
}
