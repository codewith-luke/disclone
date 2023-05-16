import {Button, type ButtonProps} from "solid-headless";
import {Show} from "solid-js";

export default function ButtonPrimary(props: ButtonProps) {
    return (
        <Button
            class="bg-buttons-primary hover:bg-buttons-secondary disabled:bg-buttons-disabled text-white border-none"
            type={props.type}
            disabled={props.disabled}
            onClick={props.onClick}
            value={props.value}
        >
            <Show when={props.children} fallback={props.value}>
                {props.children}
            </Show>
        </Button>
    )
}
