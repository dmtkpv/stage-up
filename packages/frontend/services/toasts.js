import { shallowReactive } from 'vue'

export default function ({ errors }) {



    // -------------------
    // Data
    // -------------------

    const items = shallowReactive([]);
    const time = 3000;



    // -------------------
    // Toast
    // -------------------

    class Toast {

        constructor (text, type) {
            this.text = text;
            this.type = type;
            this.wait()
        }

        remove () {
            this.stop();
            const index = items.indexOf(this);
            if (index > -1) items.splice(index, 1);
        }

        wait () {
            this.timeout = setTimeout(() => this.remove(), time)
        }

        stop () {
            clearTimeout(this.timeout);
        }

    }



    // -------------------
    // API
    // -------------------

    function add (text, type) {
        items.push(new Toast(text, type))
    }

    function error (error, form) {
        add(errors.message(error, form), 'error');
    }

    function info (text) {
        add(text, 'info');
    }



    // -------------------
    // Exports
    // -------------------

    return {
        items,
        info,
        error
    }


}