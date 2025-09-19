import { render } from '#root/global/utils.js'

export default function ({ state }) {

    function message (error, form) {
        const label = error.data?.label;
        if (form && label) {
            const text = form.find(field => Object.keys(field.inputs).includes(label))?.label || label;
            if (text) error.data.label = text;
        }
        return render(error.message, error.data || {})
    }

    function get (code) {
        const store = state.content.errors;
        return store.find(error => error.code === code);
    }

    return {
        get,
        message
    }

}