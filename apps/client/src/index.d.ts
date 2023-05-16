declare module "solid-js" {
    namespace JSX {
        interface Directives {
            submit: (ref: HTMLFormElement, accessor: () => (el: HTMLFormElement) => unknown) => void;
            validate: (ref: HTMLInputElement, accessor: () => (el: HTMLInputElement) => unknown) => void;
        }
    }
}
