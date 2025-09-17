import { reactive, markRaw } from 'vue'
import modals from '#root/config/modals.js'

export default function ({ state }) {



    // -------------------
    // Options
    // -------------------

    const defaults = {
        active: false,
        attrs: null,
        name: null,
        component: null,
    }



    // -------------------
    // Modal
    // -------------------

    const modal = reactive({

        ...defaults,

        async show (name, attrs) {
            const data = modals.find(data => data.name === name);
            if (!data) throw new Error(`Config for modal "${name}" not found`);
            state.loadingModal = true;
            data.component().then(module => {
                modal.active = true;
                modal.attrs = attrs;
                modal.name = data.name;
                modal.component = markRaw(module.default);
                modal.noOutsideClick = data.noOutsideClick;
                state.loadingModal = false;
            })
        },

        hide () {
            modal.active = false;
        }

    })



    // -------------------
    // Sidebar
    // -------------------

    const sidebar = reactive({

        ...defaults,

        show ({ active, attrs, name, component }) {
            sidebar.active = active;
            sidebar.attrs = attrs;
            sidebar.name = name;
            sidebar.component = markRaw(component);
        },

        hide () {
            sidebar.active = false;
        }

    })



    // -------------------
    // Exports
    // -------------------

    return {
        modal,
        sidebar
    }



}