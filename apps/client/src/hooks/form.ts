import {createStore} from "solid-js/store";

function checkValid({element, validators = []}, setErrors, errorClass) {
    return async () => {
        element.setCustomValidity("");
        element.checkValidity();
        let message = element.validationMessage;
        if (!message) {
            for (const validator of validators) {
                const text = await validator(element);
                if (text) {
                    element.setCustomValidity(text);
                    break;
                }
            }
            message = element.validationMessage;
        }
        if (message) {
            errorClass && element.classList.toggle(errorClass, true);
            setErrors({[element.name]: message});
        }
    };
}

// TODO: fix types
export function useForm({errorClass}) {
    const [errors, setErrors] = createStore({}),
        fields = {};

    function validate(ref: HTMLInputElement, accessor: () => (el: HTMLInputElement) => any) {
        const validators = accessor() || [];
        if (!validators.length) return;

        let config;
        fields[ref.name] = config = {element: ref, validators};
        ref.onblur = checkValid(config, setErrors, errorClass);
        ref.oninput = () => {
            if (!errors[ref.name]) return;
            setErrors({[ref.name]: undefined});
            errorClass && ref.classList.toggle(errorClass, false);
        };
    }

    function submit(ref: HTMLFormElement, accessor: () => (el: HTMLFormElement) => any) {
        ref.setAttribute("novalidate", "");
        const callback = accessor() || (() => {
        });

        ref.onsubmit = async (e: SubmitEvent) => {
            e.preventDefault();

            callback(ref);

            if (ref.attributes.getNamedItem("reset")) {
                ref.reset();
            }
        };

        return []
    }

    return {
        submit,
        validate,
    }
}
