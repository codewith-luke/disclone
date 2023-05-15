declare module "solid-js" {
  namespace JSX {
    interface Directives {
      submit: (ref: HTMLFormElement, accessor: () => (el: HTMLFormElement) => unknown) => void;
    }
  }
}
